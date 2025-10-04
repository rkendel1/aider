import * as vscode from 'vscode';
import { AiderChatProvider } from './chatProvider';
import { AiderFilesProvider } from './filesProvider';
import { AiderPreviewProvider, InspectorData } from './previewProvider';
import { AiderClient } from './aiderClient';
import { GitHubClient } from './githubClient';
import { ProviderManager, AIProvider } from './providerManager';

let aiderClient: AiderClient;
let chatProvider: AiderChatProvider;
let filesProvider: AiderFilesProvider;
let previewProvider: AiderPreviewProvider;
let githubClient: GitHubClient;
let providerManager: ProviderManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Aider extension is now active!');

    // Initialize Aider client
    const config = vscode.workspace.getConfiguration('aider');
    const apiEndpoint = config.get<string>('apiEndpoint', 'http://localhost:8501');
    aiderClient = new AiderClient(apiEndpoint);

    // Initialize GitHub client
    githubClient = new GitHubClient();

    // Initialize provider manager
    providerManager = new ProviderManager();

    // Configure providers from settings
    const ollamaEnabled = config.get<boolean>('aiProvider.ollama.enabled', false);
    const ollamaEndpoint = config.get<string>('aiProvider.ollama.endpoint', 'http://localhost:11434');
    const ollamaModel = config.get<string>('aiProvider.ollama.model', 'llama2');
    
    providerManager.setProviderEnabled(AIProvider.Ollama, ollamaEnabled);
    providerManager.updateProviderConfig(AIProvider.Ollama, {
        endpoint: ollamaEndpoint,
        model: ollamaModel
    });

    const copilotEnabled = config.get<boolean>('aiProvider.copilot.enabled', false);
    providerManager.setProviderEnabled(AIProvider.Copilot, copilotEnabled);

    // Set default provider
    const defaultProvider = config.get<string>('aiProvider.default', 'default') as AIProvider;
    providerManager.setCurrentProvider(defaultProvider);

    // Check GitHub CLI availability
    checkGitHubCLI();

    // Initialize providers
    chatProvider = new AiderChatProvider(context.extensionUri, aiderClient, providerManager);
    filesProvider = new AiderFilesProvider(aiderClient);
    previewProvider = new AiderPreviewProvider(
        context.extensionUri,
        (data: InspectorData) => handleInspectorData(data)
    );

    // Register webview provider for chat
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('aider.chatView', chatProvider)
    );

    // Register tree data provider for files
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('aider.filesView', filesProvider)
    );

    // Register webview provider for preview
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('aider.previewView', previewProvider)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.startChat', async () => {
            await vscode.commands.executeCommand('workbench.view.extension.aider-sidebar');
            vscode.window.showInformationMessage('Aider chat started!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.sendMessage', async () => {
            const message = await vscode.window.showInputBox({
                prompt: 'Enter your message to Aider',
                placeHolder: 'What would you like to change?'
            });
            
            if (message) {
                await chatProvider.sendMessage(message);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.addFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const filePath = vscode.workspace.asRelativePath(editor.document.uri);
                await aiderClient.addFile(filePath);
                filesProvider.refresh();
                vscode.window.showInformationMessage(`Added ${filePath} to chat`);
            } else {
                vscode.window.showErrorMessage('No active editor');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.removeFile', async (item) => {
            if (item && item.filePath) {
                await aiderClient.removeFile(item.filePath);
                filesProvider.refresh();
                vscode.window.showInformationMessage(`Removed ${item.filePath} from chat`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.clearChat', async () => {
            const result = await vscode.window.showWarningMessage(
                'Are you sure you want to clear chat history?',
                'Yes', 'No'
            );
            
            if (result === 'Yes') {
                await aiderClient.clearChat();
                chatProvider.clearMessages();
                vscode.window.showInformationMessage('Chat history cleared');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.undoChanges', async () => {
            try {
                await aiderClient.undoLastCommit();
                vscode.window.showInformationMessage('Undid last Aider changes');
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to undo: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.showDiff', async () => {
            try {
                const diff = await aiderClient.getDiff();
                const doc = await vscode.workspace.openTextDocument({
                    content: diff,
                    language: 'diff'
                });
                await vscode.window.showTextDocument(doc);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to get diff: ${error}`);
            }
        })
    );

    // Refresh files view when workspace changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    watcher.onDidChange(() => filesProvider.refresh());
    watcher.onDidCreate(() => filesProvider.refresh());
    watcher.onDidDelete(() => filesProvider.refresh());
    context.subscriptions.push(watcher);

    // Register command to set preview URL
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.setPreviewUrl', async () => {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter the URL of your application',
                placeHolder: 'http://localhost:3000',
                value: config.get<string>('previewUrl', 'http://localhost:3000')
            });
            
            if (url) {
                previewProvider.setPreviewUrl(url);
                await config.update('previewUrl', url, vscode.ConfigurationTarget.Workspace);
            }
        })
    );

    // Register command to paste from clipboard to chat
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.pasteToChat', async () => {
            const clipboardText = await vscode.env.clipboard.readText();
            if (clipboardText) {
                chatProvider.pasteToInput(clipboardText);
            }
        })
    );

    // GitHub CLI Integration Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.push', async () => {
            try {
                await githubClient.push();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to push: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.pull', async () => {
            try {
                await githubClient.pull();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to pull: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.createBranch', async () => {
            const branchName = await vscode.window.showInputBox({
                prompt: 'Enter branch name',
                placeHolder: 'feature/my-new-feature'
            });
            
            if (branchName) {
                try {
                    await githubClient.createBranch(branchName);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to create branch: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.createPR', async () => {
            const title = await vscode.window.showInputBox({
                prompt: 'Enter pull request title',
                placeHolder: 'Add new feature'
            });
            
            if (title) {
                const body = await vscode.window.showInputBox({
                    prompt: 'Enter pull request description (optional)',
                    placeHolder: 'Description of changes...'
                });
                
                try {
                    await githubClient.createPullRequest(title, body);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to create pull request: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.clone', async () => {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter repository URL or owner/repo',
                placeHolder: 'owner/repository or https://github.com/owner/repo'
            });
            
            if (url) {
                const directory = await vscode.window.showInputBox({
                    prompt: 'Enter target directory (optional)',
                    placeHolder: 'Leave empty for default'
                });
                
                try {
                    await githubClient.cloneRepository(url, directory || undefined);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to clone repository: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.fetchTemplate', async () => {
            const templateRepo = await vscode.window.showInputBox({
                prompt: 'Enter template repository',
                placeHolder: 'owner/template-repo'
            });
            
            if (templateRepo) {
                const targetPath = await vscode.window.showInputBox({
                    prompt: 'Enter target path (optional)',
                    placeHolder: 'Leave empty for default'
                });
                
                try {
                    await githubClient.fetchTemplate(templateRepo, targetPath || undefined);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to fetch template: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.naturalLanguage', async () => {
            const command = await vscode.window.showInputBox({
                prompt: 'What would you like to do with GitHub?',
                placeHolder: 'e.g., push changes, create a branch, create a pull request, clone a repo, fetch a template'
            });
            
            if (command) {
                try {
                    await githubClient.processNaturalLanguageCommand(command);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to execute command: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.github.authenticate', async () => {
            try {
                await githubClient.authenticate();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to authenticate: ${error}`);
            }
        })
    );
}

function handleInspectorData(data: InspectorData) {
    // Format the inspector data for pasting into chat
    let text = '';
    
    if (data.componentName) {
        text += `Update the ${data.componentName} component:\n`;
    } else {
        text += `Update the <${data.elementType}> element:\n`;
    }
    
    if (data.cssClasses && data.cssClasses.length > 0) {
        text += `CSS Classes: ${data.cssClasses.join(', ')}\n`;
    }
    
    if (data.inlineStyles) {
        text += `Inline Styles: ${data.inlineStyles}\n`;
    }
    
    // Paste to chat input
    chatProvider.pasteToInput(text);
}

async function checkGitHubCLI() {
    const isInstalled = await githubClient.isGitHubCLIInstalled();
    
    if (!isInstalled) {
        const response = await vscode.window.showWarningMessage(
            'GitHub CLI (gh) is not installed. Some features will be unavailable.',
            'Install Instructions',
            'Dismiss'
        );
        
        if (response === 'Install Instructions') {
            vscode.env.openExternal(vscode.Uri.parse('https://github.com/cli/cli#installation'));
        }
        return;
    }
    
    const isAuthenticated = await githubClient.isAuthenticated();
    
    if (!isAuthenticated) {
        const response = await vscode.window.showInformationMessage(
            'GitHub CLI is installed but not authenticated. Authenticate now?',
            'Authenticate',
            'Later'
        );
        
        if (response === 'Authenticate') {
            try {
                await githubClient.authenticate();
            } catch (error) {
                vscode.window.showErrorMessage(`Authentication failed: ${error}`);
            }
        }
    }
}

export function deactivate() {
    console.log('Aider extension is now deactivated');
    if (githubClient) {
        githubClient.dispose();
    }
}
