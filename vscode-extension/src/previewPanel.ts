import * as vscode from 'vscode';
import { InspectorData } from './previewProvider';

/**
 * Full-page preview panel for visual-first workflow
 */
export class AiderPreviewPanel {
    public static currentPanel: AiderPreviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private previewUrl: string = '';
    private onInspectorDataCallback: (data: InspectorData) => void;
    private onRouteChangeCallback?: (route: string) => void;
    private onOpenFileCallback?: (filePath: string, line?: number) => void;

    public static createOrShow(
        extensionUri: vscode.Uri,
        onInspectorData: (data: InspectorData) => void,
        onRouteChange?: (route: string) => void,
        onOpenFile?: (filePath: string, line?: number) => void
    ) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (AiderPreviewPanel.currentPanel) {
            AiderPreviewPanel.currentPanel._panel.reveal(column);
            return AiderPreviewPanel.currentPanel;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            'aiderPreviewPanel',
            'App Preview',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        AiderPreviewPanel.currentPanel = new AiderPreviewPanel(
            panel,
            extensionUri,
            onInspectorData,
            onRouteChange,
            onOpenFile
        );
        return AiderPreviewPanel.currentPanel;
    }

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        onInspectorData: (data: InspectorData) => void,
        onRouteChange?: (route: string) => void,
        onOpenFile?: (filePath: string, line?: number) => void
    ) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this.onInspectorDataCallback = onInspectorData;
        this.onRouteChangeCallback = onRouteChange;
        this.onOpenFileCallback = onOpenFile;

        // Load default URL from config
        const config = vscode.workspace.getConfiguration('aider');
        this.previewUrl = config.get<string>('previewUrl', 'http://localhost:3000');

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.type) {
                    case 'inspectorData':
                        await this.handleInspectorData(message.data);
                        break;
                    case 'setPreviewUrl':
                        this.previewUrl = message.url;
                        break;
                    case 'routeChange':
                        if (this.onRouteChangeCallback) {
                            this.onRouteChangeCallback(message.route);
                        }
                        break;
                    case 'openFile':
                        await this.handleOpenFile(message.filePath, message.line);
                        break;
                    case 'error':
                        vscode.window.showErrorMessage(`Preview Error: ${message.message}`);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    public setPreviewUrl(url: string) {
        this.previewUrl = url;
        this._panel.webview.postMessage({
            type: 'setUrl',
            url: url
        });
    }

    public refresh() {
        this._panel.webview.postMessage({
            type: 'refresh'
        });
    }

    public highlightElement(xpath: string) {
        this._panel.webview.postMessage({
            type: 'highlightElement',
            xpath: xpath
        });
    }

    public scrollToElement(xpath: string) {
        this._panel.webview.postMessage({
            type: 'scrollToElement',
            xpath: xpath
        });
    }

    private async handleInspectorData(data: InspectorData) {
        // Copy to clipboard
        const clipboardText = this.formatInspectorData(data);
        await vscode.env.clipboard.writeText(clipboardText);
        
        // Show notification with options
        const action = await vscode.window.showInformationMessage(
            `Copied ${data.componentName ? 'component' : 'element'} info to clipboard`,
            'Paste to Chat',
            'Open File',
            'Dismiss'
        );

        if (action === 'Paste to Chat') {
            this.onInspectorDataCallback(data);
        } else if (action === 'Open File' && data.filePath) {
            await this.handleOpenFile(data.filePath, data.line ?? undefined);
        }
    }

    private async handleOpenFile(filePath: string, line?: number) {
        if (this.onOpenFileCallback) {
            this.onOpenFileCallback(filePath, line);
        }

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
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open file: ${error}`);
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

        if (data.filePath) {
            text += `File: ${data.filePath}${data.line ? `:${data.line}` : ''}\n`;
        }

        return text;
    }

    public dispose() {
        AiderPreviewPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src *; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';">
            <title>App Preview</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                #controls {
                    padding: 8px 10px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                    display: flex;
                    gap: 5px;
                    align-items: center;
                    background-color: var(--vscode-sideBar-background);
                }
                #url-input {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 3px;
                    font-size: 13px;
                }
                button {
                    padding: 6px 12px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 13px;
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
                    height: calc(100vh - 42px);
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
                    font-size: 14px;
                }
                .highlight {
                    outline: 3px solid #007acc !important;
                    outline-offset: 2px;
                    background-color: rgba(0, 122, 204, 0.1) !important;
                }
                #status-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 4px 8px;
                    background-color: var(--vscode-statusBar-background);
                    color: var(--vscode-statusBar-foreground);
                    font-size: 12px;
                    border-top: 1px solid var(--vscode-panel-border);
                    display: none;
                }
                #status-bar.visible {
                    display: block;
                }
            </style>
        </head>
        <body>
            <div id="controls">
                <input type="text" id="url-input" placeholder="http://localhost:3000" value="${this.previewUrl}" />
                <button id="load-button">Load</button>
                <button id="refresh-button">Refresh</button>
                <button id="inspector-toggle">Inspector Off</button>
            </div>
            <div id="preview-container">
                <div id="no-preview">Enter a URL to preview your application</div>
                <div id="status-bar"></div>
            </div>
            
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                const urlInput = document.getElementById('url-input');
                const loadButton = document.getElementById('load-button');
                const refreshButton = document.getElementById('refresh-button');
                const inspectorToggle = document.getElementById('inspector-toggle');
                const previewContainer = document.getElementById('preview-container');
                const noPreview = document.getElementById('no-preview');
                const statusBar = document.getElementById('status-bar');
                
                let inspectorEnabled = false;
                let previewFrame = null;
                let lastRoute = '';

                // Auto-load on startup if URL is set
                if (urlInput.value.trim()) {
                    loadPreview();
                }

                loadButton.addEventListener('click', loadPreview);
                refreshButton.addEventListener('click', () => {
                    if (previewFrame) {
                        previewFrame.src = previewFrame.src;
                    }
                });
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
                    previewFrame.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals';
                    
                    previewFrame.onload = () => {
                        vscode.postMessage({ type: 'setPreviewUrl', url: url });
                        setupInspector();
                        monitorRouteChanges();
                        showStatus('Preview loaded');
                    };

                    previewFrame.onerror = () => {
                        vscode.postMessage({ 
                            type: 'error', 
                            message: 'Failed to load preview. Make sure the URL is accessible and allows embedding.' 
                        });
                    };

                    previewContainer.insertBefore(previewFrame, statusBar);
                }

                function toggleInspector() {
                    inspectorEnabled = !inspectorEnabled;
                    inspectorToggle.textContent = inspectorEnabled ? 'Inspector On' : 'Inspector Off';
                    inspectorToggle.classList.toggle('active', inspectorEnabled);
                    
                    if (inspectorEnabled && previewFrame) {
                        setupInspector();
                        showStatus('Inspector enabled - click elements to inspect');
                    } else {
                        showStatus('Inspector disabled');
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

                function monitorRouteChanges() {
                    if (!previewFrame) return;

                    try {
                        const frameWindow = previewFrame.contentWindow;
                        if (!frameWindow) return;

                        // Monitor URL changes for route detection
                        setInterval(() => {
                            try {
                                const currentUrl = frameWindow.location.href;
                                const currentRoute = frameWindow.location.pathname;
                                
                                if (currentRoute !== lastRoute) {
                                    lastRoute = currentRoute;
                                    vscode.postMessage({ 
                                        type: 'routeChange', 
                                        route: currentRoute 
                                    });
                                    showStatus('Route: ' + currentRoute);
                                }
                            } catch (e) {
                                // Cross-origin restriction
                            }
                        }, 1000);
                    } catch (e) {
                        // Cross-origin restriction
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

                    showStatus('Inspected: ' + (inspectorData.componentName || inspectorData.elementType));
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
                        componentName: null,
                        filePath: null,
                        line: null
                    };

                    // Try to detect React component
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
                                
                                // Try to extract source location from React fiber
                                if (fiber._debugSource) {
                                    data.filePath = fiber._debugSource.fileName;
                                    data.line = fiber._debugSource.lineNumber;
                                } else if (fiber._debugOwner && fiber._debugOwner._debugSource) {
                                    data.filePath = fiber._debugOwner._debugSource.fileName;
                                    data.line = fiber._debugOwner._debugSource.lineNumber;
                                }
                            }
                            break;
                        }
                    }

                    // Fallback: check for data attributes
                    if (!data.componentName) {
                        const dataComponent = element.getAttribute('data-component') || 
                                             element.getAttribute('data-testid') ||
                                             element.getAttribute('data-react-component');
                        if (dataComponent) {
                            data.componentName = dataComponent;
                        }
                    }

                    // Check for file path in data attributes (for frameworks that expose this)
                    if (!data.filePath) {
                        data.filePath = element.getAttribute('data-file') || 
                                       element.getAttribute('data-source-file');
                        data.line = parseInt(element.getAttribute('data-line') || '0') || null;
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

                function showStatus(message) {
                    statusBar.textContent = message;
                    statusBar.classList.add('visible');
                    setTimeout(() => {
                        statusBar.classList.remove('visible');
                    }, 3000);
                }

                // Handle messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'setUrl':
                            urlInput.value = message.url;
                            loadPreview();
                            break;
                        case 'refresh':
                            if (previewFrame) {
                                previewFrame.src = previewFrame.src;
                            }
                            break;
                        case 'highlightElement':
                            highlightElementByXPath(message.xpath);
                            break;
                        case 'scrollToElement':
                            scrollToElementByXPath(message.xpath);
                            break;
                    }
                });

                function highlightElementByXPath(xpath) {
                    if (!previewFrame) return;
                    
                    try {
                        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                        const result = frameDoc.evaluate(xpath, frameDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        const element = result.singleNodeValue;
                        
                        if (element) {
                            // Remove previous highlights
                            frameDoc.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
                            // Add new highlight
                            element.classList.add('highlight');
                            setTimeout(() => element.classList.remove('highlight'), 3000);
                        }
                    } catch (e) {
                        console.error('Failed to highlight element:', e);
                    }
                }

                function scrollToElementByXPath(xpath) {
                    if (!previewFrame) return;
                    
                    try {
                        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                        const result = frameDoc.evaluate(xpath, frameDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        const element = result.singleNodeValue;
                        
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('highlight');
                            setTimeout(() => element.classList.remove('highlight'), 2000);
                        }
                    } catch (e) {
                        console.error('Failed to scroll to element:', e);
                    }
                }
            </script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
