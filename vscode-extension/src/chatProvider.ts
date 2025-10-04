import * as vscode from 'vscode';
import { AiderClient, AiderMessage } from './aiderClient';
import { ProviderManager, AIProvider } from './providerManager';

/**
 * Provider for the Aider chat webview
 */
export class AiderChatProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'aider.chatView';
    private _view?: vscode.WebviewView;
    private messages: AiderMessage[] = [];
    private providerManager: ProviderManager;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly aiderClient: AiderClient,
        providerManager?: ProviderManager
    ) {
        this.providerManager = providerManager || new ProviderManager();
    }

    public async resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Load chat history
        await this.loadChatHistory();

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.type) {
                case 'sendMessage':
                    await this.sendMessage(data.message, data.provider);
                    break;
                case 'clearChat':
                    await this.clearMessages();
                    break;
                case 'setProvider':
                    this.providerManager.setCurrentProvider(data.provider);
                    this._view?.webview.postMessage({
                        type: 'providerChanged',
                        provider: data.provider
                    });
                    break;
                case 'getProviders':
                    this._view?.webview.postMessage({
                        type: 'providersList',
                        providers: this.providerManager.getAllProviders(),
                        current: this.providerManager.getCurrentProvider()
                    });
                    break;
            }
        });
    }

    public async sendMessage(message: string, provider?: AIProvider) {
        if (!this._view) {
            return;
        }

        // Determine which provider to use
        let selectedProvider = provider;
        if (!selectedProvider) {
            // Auto-select based on complexity if not manually specified
            const config = vscode.workspace.getConfiguration('aider');
            const autoSelect = config.get<boolean>('aiProvider.autoSelect', false);
            
            if (autoSelect) {
                selectedProvider = this.providerManager.analyzeQueryComplexity(message);
            } else {
                selectedProvider = this.providerManager.getCurrentProvider();
            }
        }

        // Add user message
        this.messages.push({ role: 'user', content: message, provider: selectedProvider });
        this._view.webview.postMessage({
            type: 'addMessage',
            message: { role: 'user', content: message, provider: selectedProvider }
        });

        try {
            // Send to Aider backend with provider info
            const response = await this.aiderClient.sendMessage(message, selectedProvider);
            
            // Add assistant responses
            if (response.messages) {
                for (const msg of response.messages) {
                    const messageWithProvider = { ...msg, provider: response.provider || selectedProvider };
                    this.messages.push(messageWithProvider);
                    this._view.webview.postMessage({
                        type: 'addMessage',
                        message: messageWithProvider
                    });
                }
            }

            // Handle edits if any
            if (response.edits) {
                for (const edit of response.edits) {
                    await this.handleEdit(edit);
                }
            }
        } catch (error) {
            const errorMsg = { 
                role: 'system' as const, 
                content: `Error: ${error}`,
                provider: selectedProvider
            };
            this.messages.push(errorMsg);
            this._view.webview.postMessage({
                type: 'addMessage',
                message: errorMsg
            });
        }
    }

    public pasteToInput(text: string) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'pasteText',
                text: text
            });
        }
    }

    public getProviderManager(): ProviderManager {
        return this.providerManager;
    }

    public async clearMessages() {
        this.messages = [];
        if (this._view) {
            this._view.webview.postMessage({ type: 'clearMessages' });
        }
    }

    private async loadChatHistory() {
        try {
            const history = await this.aiderClient.getChatHistory();
            this.messages = history;
            
            if (this._view) {
                for (const msg of history) {
                    this._view.webview.postMessage({
                        type: 'addMessage',
                        message: msg
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    private async handleEdit(edit: any) {
        const config = vscode.workspace.getConfiguration('aider');
        const showDiffs = config.get<boolean>('showDiffs', true);

        if (edit.fnames && edit.fnames.length > 0) {
            const filesMsg = `Applied edits to: ${edit.fnames.join(', ')}`;
            vscode.window.showInformationMessage(filesMsg);
        }

        if (showDiffs && edit.diff) {
            const doc = await vscode.workspace.openTextDocument({
                content: edit.diff,
                language: 'diff'
            });
            await vscode.window.showTextDocument(doc, { preview: true });
        }

        if (edit.commit_hash) {
            vscode.window.showInformationMessage(
                `Commit ${edit.commit_hash}: ${edit.commit_message || 'Changes applied'}`,
                'Undo'
            ).then(selection => {
                if (selection === 'Undo') {
                    vscode.commands.executeCommand('aider.undoChanges');
                }
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aider Chat</title>
            <style>
                body {
                    padding: 10px;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                #messages {
                    height: calc(100vh - 120px);
                    overflow-y: auto;
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                }
                .message {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 4px;
                }
                .message.user {
                    background-color: var(--vscode-input-background);
                    border-left: 3px solid var(--vscode-button-background);
                }
                .message.assistant {
                    background-color: var(--vscode-editor-inactiveSelectionBackground);
                    border-left: 3px solid var(--vscode-textLink-foreground);
                }
                .message.system, .message.info {
                    background-color: var(--vscode-inputValidation-infoBackground);
                    border-left: 3px solid var(--vscode-inputValidation-infoBorder);
                    font-style: italic;
                }
                .message-role {
                    font-weight: bold;
                    margin-bottom: 5px;
                    text-transform: capitalize;
                }
                .message-provider {
                    font-size: 0.8em;
                    color: var(--vscode-descriptionForeground);
                    margin-left: 8px;
                }
                .message-content {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                #provider-container {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 10px;
                    padding: 8px;
                    background-color: var(--vscode-sideBar-background);
                    border-radius: 4px;
                    align-items: center;
                }
                #provider-container label {
                    font-weight: bold;
                    margin-right: 5px;
                }
                #provider-select {
                    padding: 4px 8px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 4px;
                    cursor: pointer;
                }
                #input-container {
                    display: flex;
                    gap: 5px;
                }
                #message-input {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 4px;
                }
                button {
                    padding: 8px 15px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            </style>
        </head>
        <body>
            <div id="provider-container">
                <label for="provider-select">AI Provider:</label>
                <select id="provider-select">
                    <option value="default">Default</option>
                    <option value="ollama">Ollama</option>
                    <option value="copilot">GitHub Copilot</option>
                </select>
            </div>
            <div id="messages"></div>
            <div id="input-container">
                <input type="text" id="message-input" placeholder="Ask Aider to modify your code..." />
                <button id="send-button">Send</button>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                const messagesContainer = document.getElementById('messages');
                const messageInput = document.getElementById('message-input');
                const sendButton = document.getElementById('send-button');
                const providerSelect = document.getElementById('provider-select');

                // Request current provider list on load
                vscode.postMessage({ type: 'getProviders' });

                function addMessage(message) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + message.role;
                    
                    const roleDiv = document.createElement('div');
                    roleDiv.className = 'message-role';
                    roleDiv.textContent = message.role;
                    
                    // Add provider badge if available
                    if (message.provider && message.provider !== 'default') {
                        const providerSpan = document.createElement('span');
                        providerSpan.className = 'message-provider';
                        providerSpan.textContent = '(' + message.provider + ')';
                        roleDiv.appendChild(providerSpan);
                    }
                    
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'message-content';
                    contentDiv.textContent = message.content;
                    
                    messageDiv.appendChild(roleDiv);
                    messageDiv.appendChild(contentDiv);
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                function sendMessage() {
                    const message = messageInput.value.trim();
                    if (message) {
                        const selectedProvider = providerSelect.value;
                        vscode.postMessage({
                            type: 'sendMessage',
                            message: message,
                            provider: selectedProvider
                        });
                        messageInput.value = '';
                    }
                }

                // Handle provider change
                providerSelect.addEventListener('change', (e) => {
                    const selectedProvider = e.target.value;
                    vscode.postMessage({
                        type: 'setProvider',
                        provider: selectedProvider
                    });
                });

                sendButton.addEventListener('click', sendMessage);
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });

                // Handle messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'addMessage':
                            addMessage(message.message);
                            break;
                        case 'clearMessages':
                            messagesContainer.innerHTML = '';
                            break;
                        case 'pasteText':
                            messageInput.value = message.text;
                            messageInput.focus();
                            break;
                        case 'providerChanged':
                            providerSelect.value = message.provider;
                            break;
                        case 'providersList':
                            // Update dropdown with available providers
                            if (message.providers) {
                                providerSelect.innerHTML = '';
                                message.providers.forEach(provider => {
                                    const option = document.createElement('option');
                                    option.value = provider.type;
                                    option.textContent = provider.name;
                                    option.disabled = !provider.enabled;
                                    providerSelect.appendChild(option);
                                });
                                if (message.current) {
                                    providerSelect.value = message.current;
                                }
                            }
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
