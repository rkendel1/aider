import * as vscode from 'vscode';
import { AiderChatProvider } from './chatProvider';
import { AiderFilesProvider } from './filesProvider';
import { AiderPreviewProvider, InspectorData } from './previewProvider';
import { AiderPreviewPanel } from './previewPanel';
import { AiderClient } from './aiderClient';
import { GitHubClient } from './githubClient';
import { ProviderManager, AIProvider } from './providerManager';
import { ProjectContextManager } from './projectContext';
import { ProjectContextProvider } from './projectContextProvider';

let aiderClient: AiderClient;
let chatProvider: AiderChatProvider;
let filesProvider: AiderFilesProvider;
let previewProvider: AiderPreviewProvider;
let githubClient: GitHubClient;
let providerManager: ProviderManager;
let projectContextManager: ProjectContextManager | undefined;
let projectContextProvider: ProjectContextProvider | undefined;

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
    const ollamaVisionModel = config.get<string>('aiProvider.ollama.visionModel', 'llama3.2-vision');
    
    providerManager.setProviderEnabled(AIProvider.Ollama, ollamaEnabled);
    providerManager.updateProviderConfig(AIProvider.Ollama, {
        endpoint: ollamaEndpoint,
        model: ollamaModel,
        visionModel: ollamaVisionModel,
        supportsVision: true
    });

    const copilotEnabled = config.get<boolean>('aiProvider.copilot.enabled', false);
    providerManager.setProviderEnabled(AIProvider.Copilot, copilotEnabled);

    // Set default provider
    const defaultProvider = config.get<string>('aiProvider.default', 'default') as AIProvider;
    providerManager.setCurrentProvider(defaultProvider);

    // Initialize project context manager if enabled
    const projectContextEnabled = config.get<boolean>('projectContext.enabled', true);
    if (projectContextEnabled && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        projectContextManager = new ProjectContextManager(workspaceRoot);
        projectContextManager.initialize().catch(err => {
            console.error('Failed to initialize project context:', err);
        });

        // Initialize project context provider
        projectContextProvider = new ProjectContextProvider(context.extensionUri, projectContextManager);
    }

    // Check GitHub CLI availability
    checkGitHubCLI();

    // Initialize providers
    chatProvider = new AiderChatProvider(context.extensionUri, aiderClient, providerManager, projectContextManager);
    filesProvider = new AiderFilesProvider(aiderClient);
    previewProvider = new AiderPreviewProvider(
        context.extensionUri,
        (data: InspectorData) => handleInspectorData(data)
    );

    // Auto-open preview panel if enabled
    const autoOpenPreview = config.get<boolean>('autoOpenPreview', true);
    if (autoOpenPreview) {
        // Open after a short delay to ensure workspace is ready
        setTimeout(() => {
            vscode.commands.executeCommand('aider.openPreviewPanel');
        }, 1000);
    }

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

    // Register project context provider if available
    if (projectContextProvider) {
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('aider.projectContextView', projectContextProvider)
        );
    }

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

    // Register screenshot commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.uploadScreenshot', async () => {
            const uri = await vscode.window.showOpenDialog({
                canSelectMany: false,
                filters: {
                    'Images': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
                },
                title: 'Select Screenshot for Code Generation'
            });

            if (uri && uri[0]) {
                try {
                    const fileData = await vscode.workspace.fs.readFile(uri[0]);
                    const base64 = Buffer.from(fileData).toString('base64');
                    const mimeType = getMimeType(uri[0].fsPath);
                    const dataUrl = `data:${mimeType};base64,${base64}`;
                    
                    await chatProvider.handleScreenshot({
                        dataUrl,
                        fileName: uri[0].fsPath.split('/').pop(),
                        timestamp: Date.now()
                    });
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to load screenshot: ${error}`);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.pasteScreenshot', async () => {
            vscode.window.showInformationMessage('Please paste the screenshot directly in the chat panel or use the drag-and-drop area.');
            await vscode.commands.executeCommand('workbench.view.extension.aider-sidebar');
        })
    );

    // Register project context commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.viewProjectContext', async () => {
            await vscode.commands.executeCommand('workbench.view.extension.aider-sidebar');
            await vscode.commands.executeCommand('aider.projectContextView.focus');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.editProjectContext', async () => {
            if (!projectContextManager) {
                vscode.window.showWarningMessage('Project context is not enabled or no workspace is open');
                return;
            }

            const context = projectContextManager.getContext();
            if (!context) {
                vscode.window.showErrorMessage('Failed to load project context');
                return;
            }

            // Open project context view
            await vscode.commands.executeCommand('aider.viewProjectContext');
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

    // Full-page preview panel commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aider.openPreviewPanel', async () => {
            const panel = AiderPreviewPanel.createOrShow(
                context.extensionUri,
                (data: InspectorData) => handleInspectorData(data),
                (route: string) => handleRouteChange(route),
                (filePath: string, line?: number) => handleOpenFile(filePath, line)
            );
            
            // Set the preview URL from config
            const previewUrl = config.get<string>('previewUrl', 'http://localhost:3000');
            panel.setPreviewUrl(previewUrl);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.refreshPreview', () => {
            if (AiderPreviewPanel.currentPanel) {
                AiderPreviewPanel.currentPanel.refresh();
            } else {
                vscode.window.showWarningMessage('No preview panel is open');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.highlightElement', async (xpath?: string) => {
            if (!AiderPreviewPanel.currentPanel) {
                vscode.window.showWarningMessage('No preview panel is open');
                return;
            }

            if (!xpath) {
                xpath = await vscode.window.showInputBox({
                    prompt: 'Enter element XPath to highlight',
                    placeHolder: '//*[@id="my-element"]'
                });
            }

            if (xpath) {
                AiderPreviewPanel.currentPanel.highlightElement(xpath);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aider.scrollToElement', async (xpath?: string) => {
            if (!AiderPreviewPanel.currentPanel) {
                vscode.window.showWarningMessage('No preview panel is open');
                return;
            }

            if (!xpath) {
                xpath = await vscode.window.showInputBox({
                    prompt: 'Enter element XPath to scroll to',
                    placeHolder: '//*[@id="my-element"]'
                });
            }

            if (xpath) {
                AiderPreviewPanel.currentPanel.scrollToElement(xpath);
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

    if (data.filePath) {
        text += `File: ${data.filePath}${data.line ? `:${data.line}` : ''}\n`;
    }
    
    // Paste to chat input
    chatProvider.pasteToInput(text);
}

function handleRouteChange(route: string) {
    // Show notification about route change
    vscode.window.showInformationMessage(`Route changed to: ${route}`, 'Copy Route').then(action => {
        if (action === 'Copy Route') {
            vscode.env.clipboard.writeText(route);
        }
    });
}

async function handleOpenFile(filePath: string, line?: number) {
    try {
        // Try to open the file in VS Code
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showWarningMessage('No workspace folder open');
            return;
        }

        const fullPath = vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
        const document = await vscode.workspace.openTextDocument(fullPath);
        const editor = await vscode.window.showTextDocument(document, {
            viewColumn: vscode.ViewColumn.Two,
            preview: false
        });

        // Jump to line if specified
        if (line !== undefined && line > 0) {
            const position = new vscode.Position(line - 1, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(
                new vscode.Range(position, position),
                vscode.TextEditorRevealType.InCenter
            );
        }

        // Optionally add file to Aider chat context
        const addToChat = await vscode.window.showInformationMessage(
            `Opened ${filePath}`,
            'Add to Chat'
        );

        if (addToChat === 'Add to Chat') {
            const relativePath = vscode.workspace.asRelativePath(fullPath);
            await aiderClient.addFile(relativePath);
            filesProvider.refresh();
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to open file: ${error}`);
    }
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

function getMimeType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'webp': 'image/webp'
    };
    return mimeTypes[ext || ''] || 'image/png';
}

export function deactivate() {
    console.log('Aider extension is now deactivated');
    if (githubClient) {
        githubClient.dispose();
    }
}
