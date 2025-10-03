import * as vscode from 'vscode';
import { AiderClient } from './aiderClient';

/**
 * Tree item for a file in the Aider chat
 */
export class FileItem extends vscode.TreeItem {
    constructor(
        public readonly filePath: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(filePath, collapsibleState);
        this.tooltip = filePath;
        this.iconPath = new vscode.ThemeIcon('file');
        this.contextValue = 'aiderFile';
        this.command = {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [vscode.Uri.file(filePath)]
        };
    }
}

/**
 * Provider for the files tree view
 */
export class AiderFilesProvider implements vscode.TreeDataProvider<FileItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FileItem | undefined | null | void> = new vscode.EventEmitter<FileItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FileItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private aiderClient: AiderClient) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FileItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: FileItem): Promise<FileItem[]> {
        if (element) {
            return [];
        }

        try {
            const files = await this.aiderClient.getFiles();
            return files.map(file => new FileItem(file, vscode.TreeItemCollapsibleState.None));
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load files: ${error}`);
            return [];
        }
    }
}
