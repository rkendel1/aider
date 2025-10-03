import * as vscode from 'vscode';

/**
 * Provider for the Aider live preview webview with component/CSS inspector
 */
export class AiderPreviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'aider.previewView';
    private _view?: vscode.WebviewView;
    private previewUrl: string = '';

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly onInspectorData: (data: InspectorData) => void
    ) {}

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

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.type) {
                case 'inspectorData':
                    await this.handleInspectorData(data.data);
                    break;
                case 'setPreviewUrl':
                    this.previewUrl = data.url;
                    break;
                case 'error':
                    vscode.window.showErrorMessage(`Preview Error: ${data.message}`);
                    break;
            }
        });
    }

    public setPreviewUrl(url: string) {
        this.previewUrl = url;
        if (this._view) {
            this._view.webview.postMessage({
                type: 'setUrl',
                url: url
            });
        }
    }

    private async handleInspectorData(data: InspectorData) {
        // Copy to clipboard
        const clipboardText = this.formatInspectorData(data);
        await vscode.env.clipboard.writeText(clipboardText);
        
        // Show notification with options
        const action = await vscode.window.showInformationMessage(
            `Copied ${data.componentName ? 'component' : 'element'} info to clipboard`,
            'Paste to Chat',
            'Dismiss'
        );

        if (action === 'Paste to Chat') {
            this.onInspectorData(data);
        }
    }

    private formatInspectorData(data: InspectorData): string {
        let text = '';
        
        if (data.componentName) {
            text += `Component: ${data.componentName}\n`;
        }
        
        if (data.elementType) {
            text += `Element: <${data.elementType}>\n`;
        }
        
        if (data.cssClasses && data.cssClasses.length > 0) {
            text += `CSS Classes: ${data.cssClasses.join(', ')}\n`;
        }
        
        if (data.inlineStyles) {
            text += `Inline Styles: ${data.inlineStyles}\n`;
        }
        
        if (data.xpath) {
            text += `XPath: ${data.xpath}\n`;
        }

        return text;
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src *; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';">
            <title>Live Preview</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                #controls {
                    padding: 10px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                #url-input {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 3px;
                }
                button {
                    padding: 6px 12px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                #inspector-toggle {
                    background-color: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }
                #inspector-toggle.active {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                }
                #preview-container {
                    height: calc(100vh - 50px);
                    position: relative;
                }
                #preview-frame {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                #no-preview {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--vscode-descriptionForeground);
                }
                .highlight {
                    outline: 2px solid var(--vscode-focusBorder) !important;
                    outline-offset: 2px;
                }
            </style>
        </head>
        <body>
            <div id="controls">
                <input type="text" id="url-input" placeholder="http://localhost:3000" />
                <button id="load-button">Load</button>
                <button id="inspector-toggle">Inspector Off</button>
            </div>
            <div id="preview-container">
                <div id="no-preview">Enter a URL to preview your application</div>
            </div>
            
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                const urlInput = document.getElementById('url-input');
                const loadButton = document.getElementById('load-button');
                const inspectorToggle = document.getElementById('inspector-toggle');
                const previewContainer = document.getElementById('preview-container');
                const noPreview = document.getElementById('no-preview');
                
                let inspectorEnabled = false;
                let previewFrame = null;

                loadButton.addEventListener('click', loadPreview);
                urlInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        loadPreview();
                    }
                });

                inspectorToggle.addEventListener('click', toggleInspector);

                function loadPreview() {
                    const url = urlInput.value.trim();
                    if (!url) {
                        vscode.postMessage({ type: 'error', message: 'Please enter a URL' });
                        return;
                    }

                    // Remove existing frame
                    if (previewFrame) {
                        previewFrame.remove();
                    }

                    noPreview.style.display = 'none';
                    
                    // Create iframe
                    previewFrame = document.createElement('iframe');
                    previewFrame.id = 'preview-frame';
                    previewFrame.src = url;
                    previewFrame.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';
                    
                    previewFrame.onload = () => {
                        vscode.postMessage({ type: 'setPreviewUrl', url: url });
                        setupInspector();
                    };

                    previewFrame.onerror = () => {
                        vscode.postMessage({ 
                            type: 'error', 
                            message: 'Failed to load preview. Make sure the URL is accessible and allows embedding.' 
                        });
                    };

                    previewContainer.appendChild(previewFrame);
                }

                function toggleInspector() {
                    inspectorEnabled = !inspectorEnabled;
                    inspectorToggle.textContent = inspectorEnabled ? 'Inspector On' : 'Inspector Off';
                    inspectorToggle.classList.toggle('active', inspectorEnabled);
                    
                    if (inspectorEnabled && previewFrame) {
                        setupInspector();
                    }
                }

                function setupInspector() {
                    if (!previewFrame || !inspectorEnabled) {
                        return;
                    }

                    try {
                        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                        
                        // Add inspector event listeners to the iframe content
                        frameDoc.addEventListener('click', handleInspectorClick, true);
                        frameDoc.addEventListener('mouseover', handleInspectorHover, true);
                        frameDoc.addEventListener('mouseout', handleInspectorMouseOut, true);
                    } catch (e) {
                        vscode.postMessage({ 
                            type: 'error', 
                            message: 'Cannot inspect this page due to cross-origin restrictions. Try loading a local development server.' 
                        });
                    }
                }

                function handleInspectorClick(e) {
                    if (!inspectorEnabled) return;
                    
                    e.preventDefault();
                    e.stopPropagation();

                    const element = e.target;
                    const inspectorData = extractElementData(element);
                    
                    vscode.postMessage({
                        type: 'inspectorData',
                        data: inspectorData
                    });
                }

                function handleInspectorHover(e) {
                    if (!inspectorEnabled) return;
                    e.target.classList.add('highlight');
                }

                function handleInspectorMouseOut(e) {
                    if (!inspectorEnabled) return;
                    e.target.classList.remove('highlight');
                }

                function extractElementData(element) {
                    const data = {
                        elementType: element.tagName.toLowerCase(),
                        cssClasses: Array.from(element.classList),
                        inlineStyles: element.getAttribute('style') || '',
                        xpath: getXPath(element),
                        componentName: null
                    };

                    // Try to detect React component
                    // React DevTools stores component info in internal properties
                    for (const key in element) {
                        if (key.startsWith('__react')) {
                            const fiber = element[key];
                            if (fiber && fiber.type) {
                                if (typeof fiber.type === 'function') {
                                    data.componentName = fiber.type.name || fiber.type.displayName;
                                } else if (typeof fiber.type === 'string') {
                                    data.componentName = fiber.type;
                                } else if (fiber.type && fiber.type.name) {
                                    data.componentName = fiber.type.name;
                                }
                            }
                            break;
                        }
                    }

                    // Fallback: check for data attributes commonly used by frameworks
                    if (!data.componentName) {
                        const dataComponent = element.getAttribute('data-component') || 
                                             element.getAttribute('data-testid') ||
                                             element.getAttribute('data-react-component');
                        if (dataComponent) {
                            data.componentName = dataComponent;
                        }
                    }

                    return data;
                }

                function getXPath(element) {
                    if (element.id) {
                        return '//*[@id="' + element.id + '"]';
                    }
                    
                    if (element === document.body) {
                        return '/html/body';
                    }

                    let ix = 0;
                    const siblings = element.parentNode?.childNodes;
                    if (siblings) {
                        for (let i = 0; i < siblings.length; i++) {
                            const sibling = siblings[i];
                            if (sibling === element) {
                                return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                            }
                            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                                ix++;
                            }
                        }
                    }
                    return '';
                }

                // Handle messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'setUrl':
                            urlInput.value = message.url;
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}

export interface InspectorData {
    elementType: string;
    cssClasses: string[];
    inlineStyles: string;
    xpath: string;
    componentName: string | null;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
