import * as vscode from 'vscode';
import { ProjectContextManager, ProjectContext } from './projectContext';

/**
 * Provider for the project context webview
 */
export class ProjectContextProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'aider.projectContextView';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly contextManager: ProjectContextManager
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

        // Load current context
        await this.refreshContext();

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.type) {
                case 'addRule':
                    await this.contextManager.addRule(data.value);
                    await this.refreshContext();
                    break;
                case 'addPrinciple':
                    await this.contextManager.addDesignPrinciple(data.value);
                    await this.refreshContext();
                    break;
                case 'addGoal':
                    const context = this.contextManager.getContext();
                    if (context) {
                        context.goals.push(data.value);
                        await this.contextManager.updateContext(context);
                        await this.refreshContext();
                    }
                    break;
                case 'addPattern':
                    await this.contextManager.addCodingPattern(data.name, data.pattern);
                    await this.refreshContext();
                    break;
                case 'updateFramework':
                    await this.contextManager.updateContext({ framework: data.value });
                    await this.refreshContext();
                    break;
                case 'removeRule':
                    await this.removeItem('rules', data.index);
                    break;
                case 'removePrinciple':
                    await this.removeItem('designPrinciples', data.index);
                    break;
                case 'removeGoal':
                    await this.removeItem('goals', data.index);
                    break;
                case 'removePattern':
                    await this.removePattern(data.name);
                    break;
                case 'refresh':
                    await this.refreshContext();
                    break;
            }
        });
    }

    private async removeItem(type: 'rules' | 'designPrinciples' | 'goals', index: number): Promise<void> {
        const context = this.contextManager.getContext();
        if (context && context[type] && index >= 0 && index < context[type].length) {
            context[type].splice(index, 1);
            await this.contextManager.updateContext(context);
            await this.refreshContext();
        }
    }

    private async removePattern(name: string): Promise<void> {
        const context = this.contextManager.getContext();
        if (context && context.codingPatterns[name]) {
            delete context.codingPatterns[name];
            await this.contextManager.updateContext(context);
            await this.refreshContext();
        }
    }

    private async refreshContext(): Promise<void> {
        if (!this._view) {
            return;
        }

        const context = this.contextManager.getContext();
        if (context) {
            this._view.webview.postMessage({
                type: 'contextUpdated',
                context: context
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Context</title>
            <style>
                body {
                    padding: 10px;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                h2 {
                    margin-top: 20px;
                    margin-bottom: 10px;
                    font-size: 1.1em;
                    border-bottom: 1px solid var(--vscode-panel-border);
                    padding-bottom: 5px;
                }
                .section {
                    margin-bottom: 20px;
                }
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    margin-bottom: 5px;
                    background-color: var(--vscode-input-background);
                    border-radius: 4px;
                    border-left: 3px solid var(--vscode-button-background);
                }
                .item-text {
                    flex: 1;
                    word-wrap: break-word;
                }
                .item button {
                    margin-left: 8px;
                    padding: 4px 8px;
                    font-size: 0.85em;
                }
                .add-form {
                    display: flex;
                    gap: 5px;
                    margin-top: 10px;
                }
                .add-form input, .add-form textarea {
                    flex: 1;
                    padding: 6px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 4px;
                }
                .add-form textarea {
                    min-height: 60px;
                    resize: vertical;
                }
                button {
                    padding: 6px 12px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                button.danger {
                    background-color: var(--vscode-errorForeground);
                }
                .framework-input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border-radius: 4px;
                }
                .empty-state {
                    padding: 20px;
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-style: italic;
                }
                .pattern-item {
                    margin-bottom: 10px;
                }
                .pattern-name {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .info-text {
                    font-size: 0.9em;
                    color: var(--vscode-descriptionForeground);
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="section">
                <h2>Framework</h2>
                <p class="info-text">Specify the primary framework for this project</p>
                <input type="text" id="framework-input" class="framework-input" placeholder="e.g., React, Next.js, Vue.js" />
            </div>

            <div class="section">
                <h2>Project Rules</h2>
                <p class="info-text">Define coding rules and constraints</p>
                <div id="rules-list"></div>
                <div class="add-form">
                    <input type="text" id="rule-input" placeholder="Add a new rule..." />
                    <button id="add-rule-button">Add</button>
                </div>
            </div>

            <div class="section">
                <h2>Design Principles</h2>
                <p class="info-text">Define design principles and guidelines</p>
                <div id="principles-list"></div>
                <div class="add-form">
                    <input type="text" id="principle-input" placeholder="Add a design principle..." />
                    <button id="add-principle-button">Add</button>
                </div>
            </div>

            <div class="section">
                <h2>Project Goals</h2>
                <p class="info-text">Define project objectives</p>
                <div id="goals-list"></div>
                <div class="add-form">
                    <input type="text" id="goal-input" placeholder="Add a project goal..." />
                    <button id="add-goal-button">Add</button>
                </div>
            </div>

            <div class="section">
                <h2>Coding Patterns</h2>
                <p class="info-text">Define common coding patterns and templates</p>
                <div id="patterns-list"></div>
                <div class="add-form">
                    <input type="text" id="pattern-name-input" placeholder="Pattern name..." />
                    <textarea id="pattern-input" placeholder="Pattern description or template..."></textarea>
                    <button id="add-pattern-button">Add</button>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                const frameworkInput = document.getElementById('framework-input');
                const rulesList = document.getElementById('rules-list');
                const principlesList = document.getElementById('principles-list');
                const goalsList = document.getElementById('goals-list');
                const patternsList = document.getElementById('patterns-list');
                
                const ruleInput = document.getElementById('rule-input');
                const principleInput = document.getElementById('principle-input');
                const goalInput = document.getElementById('goal-input');
                const patternNameInput = document.getElementById('pattern-name-input');
                const patternInput = document.getElementById('pattern-input');

                // Framework update
                let frameworkTimeout;
                frameworkInput.addEventListener('input', () => {
                    clearTimeout(frameworkTimeout);
                    frameworkTimeout = setTimeout(() => {
                        vscode.postMessage({
                            type: 'updateFramework',
                            value: frameworkInput.value.trim()
                        });
                    }, 500);
                });

                // Add rule
                document.getElementById('add-rule-button').addEventListener('click', () => {
                    const value = ruleInput.value.trim();
                    if (value) {
                        vscode.postMessage({ type: 'addRule', value });
                        ruleInput.value = '';
                    }
                });

                ruleInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('add-rule-button').click();
                    }
                });

                // Add principle
                document.getElementById('add-principle-button').addEventListener('click', () => {
                    const value = principleInput.value.trim();
                    if (value) {
                        vscode.postMessage({ type: 'addPrinciple', value });
                        principleInput.value = '';
                    }
                });

                principleInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('add-principle-button').click();
                    }
                });

                // Add goal
                document.getElementById('add-goal-button').addEventListener('click', () => {
                    const value = goalInput.value.trim();
                    if (value) {
                        vscode.postMessage({ type: 'addGoal', value });
                        goalInput.value = '';
                    }
                });

                goalInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('add-goal-button').click();
                    }
                });

                // Add pattern
                document.getElementById('add-pattern-button').addEventListener('click', () => {
                    const name = patternNameInput.value.trim();
                    const pattern = patternInput.value.trim();
                    if (name && pattern) {
                        vscode.postMessage({ type: 'addPattern', name, pattern });
                        patternNameInput.value = '';
                        patternInput.value = '';
                    }
                });

                // Render context
                function renderContext(context) {
                    frameworkInput.value = context.framework || '';
                    
                    // Render rules
                    rulesList.innerHTML = context.rules.length === 0
                        ? '<div class="empty-state">No rules defined</div>'
                        : context.rules.map((rule, index) => 
                            '<div class="item">' +
                                '<span class="item-text">' + escapeHtml(rule) + '</span>' +
                                '<button class="danger" onclick="removeRule(' + index + ')">Remove</button>' +
                            '</div>'
                        ).join('');

                    // Render principles
                    principlesList.innerHTML = context.designPrinciples.length === 0
                        ? '<div class="empty-state">No design principles defined</div>'
                        : context.designPrinciples.map((principle, index) => 
                            '<div class="item">' +
                                '<span class="item-text">' + escapeHtml(principle) + '</span>' +
                                '<button class="danger" onclick="removePrinciple(' + index + ')">Remove</button>' +
                            '</div>'
                        ).join('');

                    // Render goals
                    goalsList.innerHTML = context.goals.length === 0
                        ? '<div class="empty-state">No goals defined</div>'
                        : context.goals.map((goal, index) => 
                            '<div class="item">' +
                                '<span class="item-text">' + escapeHtml(goal) + '</span>' +
                                '<button class="danger" onclick="removeGoal(' + index + ')">Remove</button>' +
                            '</div>'
                        ).join('');

                    // Render patterns
                    const patternEntries = Object.entries(context.codingPatterns);
                    patternsList.innerHTML = patternEntries.length === 0
                        ? '<div class="empty-state">No coding patterns defined</div>'
                        : patternEntries.map(([name, pattern]) => 
                            '<div class="item pattern-item">' +
                                '<div class="item-text">' +
                                    '<div class="pattern-name">' + escapeHtml(name) + '</div>' +
                                    '<div>' + escapeHtml(pattern) + '</div>' +
                                '</div>' +
                                '<button class="danger" onclick="removePattern(\'' + escapeHtml(name) + '\')">Remove</button>' +
                            '</div>'
                        ).join('');
                }

                function escapeHtml(text) {
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML;
                }

                window.removeRule = (index) => {
                    vscode.postMessage({ type: 'removeRule', index });
                };

                window.removePrinciple = (index) => {
                    vscode.postMessage({ type: 'removePrinciple', index });
                };

                window.removeGoal = (index) => {
                    vscode.postMessage({ type: 'removeGoal', index });
                };

                window.removePattern = (name) => {
                    vscode.postMessage({ type: 'removePattern', name });
                };

                // Handle messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'contextUpdated') {
                        renderContext(message.context);
                    }
                });

                // Request initial context
                vscode.postMessage({ type: 'refresh' });
            </script>
        </body>
        </html>`;
    }
}
