import * as vscode from 'vscode';
import { AiderChatProvider } from './chatProvider';
import { AiderFilesProvider } from './filesProvider';
import { AiderClient } from './aiderClient';

let aiderClient: AiderClient;
let chatProvider: AiderChatProvider;
let filesProvider: AiderFilesProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('Aider extension is now active!');

    // Initialize Aider client
    const config = vscode.workspace.getConfiguration('aider');
    const apiEndpoint = config.get<string>('apiEndpoint', 'http://localhost:8501');
    aiderClient = new AiderClient(apiEndpoint);

    // Initialize providers
    chatProvider = new AiderChatProvider(context.extensionUri, aiderClient);
    filesProvider = new AiderFilesProvider(aiderClient);

    // Register webview provider for chat
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('aider.chatView', chatProvider)
    );

    // Register tree data provider for files
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('aider.filesView', filesProvider)
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
}

export function deactivate() {
    console.log('Aider extension is now deactivated');
}
