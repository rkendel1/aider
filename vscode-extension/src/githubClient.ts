import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitHubOperation {
    type: 'push' | 'pull' | 'branch' | 'pr' | 'clone' | 'repo';
    description: string;
}

/**
 * Client for GitHub CLI operations
 */
export class GitHubClient {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Aider GitHub');
    }

    /**
     * Check if GitHub CLI is installed
     */
    async isGitHubCLIInstalled(): Promise<boolean> {
        try {
            await execAsync('gh --version');
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if user is authenticated with GitHub CLI
     */
    async isAuthenticated(): Promise<boolean> {
        try {
            const { stdout } = await execAsync('gh auth status');
            return stdout.includes('Logged in');
        } catch (error) {
            return false;
        }
    }

    /**
     * Authenticate with GitHub
     */
    async authenticate(): Promise<void> {
        try {
            this.outputChannel.show();
            this.outputChannel.appendLine('Starting GitHub authentication...');
            const { stdout, stderr } = await execAsync('gh auth login');
            this.outputChannel.appendLine(stdout);
            if (stderr) {
                this.outputChannel.appendLine(stderr);
            }
            vscode.window.showInformationMessage('Successfully authenticated with GitHub');
        } catch (error) {
            this.outputChannel.appendLine(`Authentication failed: ${error}`);
            throw new Error(`GitHub authentication failed: ${error}`);
        }
    }

    /**
     * Execute a GitHub CLI command
     */
    private async executeGitHubCommand(command: string, description: string): Promise<string> {
        // Check if gh CLI is installed first
        const isInstalled = await this.isGitHubCLIInstalled();
        if (!isInstalled) {
            throw new Error('GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/');
        }

        this.outputChannel.show();
        this.outputChannel.appendLine(`\n=== ${description} ===`);
        this.outputChannel.appendLine(`Command: ${command}`);
        
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stdout) {
                this.outputChannel.appendLine(stdout);
            }
            if (stderr) {
                this.outputChannel.appendLine(stderr);
            }
            return stdout;
        } catch (error: any) {
            const errorMessage = error.message || String(error);
            this.outputChannel.appendLine(`Error: ${errorMessage}`);
            
            // Provide helpful error messages
            if (errorMessage.includes('not logged in') || errorMessage.includes('authentication')) {
                throw new Error('Not authenticated with GitHub CLI. Please run "Aider GitHub: Authenticate" first.');
            } else if (errorMessage.includes('not a git repository')) {
                throw new Error('Current workspace is not a git repository. Please initialize git first.');
            }
            throw new Error(errorMessage);
        }
    }

    /**
     * Push changes to GitHub
     */
    async push(remote: string = 'origin', branch?: string): Promise<void> {
        try {
            const branchArg = branch ? ` ${branch}` : '';
            await this.executeGitHubCommand(
                `git push ${remote}${branchArg}`,
                `Pushing to ${remote}${branchArg}`
            );
            vscode.window.showInformationMessage(`Successfully pushed to ${remote}`);
        } catch (error: any) {
            this.outputChannel.appendLine(`Push failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Pull changes from GitHub
     */
    async pull(remote: string = 'origin', branch?: string): Promise<void> {
        try {
            const branchArg = branch ? ` ${branch}` : '';
            await this.executeGitHubCommand(
                `git pull ${remote}${branchArg}`,
                `Pulling from ${remote}${branchArg}`
            );
            vscode.window.showInformationMessage(`Successfully pulled from ${remote}`);
        } catch (error: any) {
            this.outputChannel.appendLine(`Pull failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a new branch
     */
    async createBranch(branchName: string, checkout: boolean = true): Promise<void> {
        try {
            const checkoutFlag = checkout ? '-b' : '';
            await this.executeGitHubCommand(
                `git ${checkout ? 'checkout' : 'branch'} ${checkoutFlag} ${branchName}`,
                `Creating branch: ${branchName}`
            );
            vscode.window.showInformationMessage(`Successfully created branch: ${branchName}`);
        } catch (error: any) {
            this.outputChannel.appendLine(`Branch creation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a pull request
     */
    async createPullRequest(title: string, body?: string, base?: string): Promise<void> {
        try {
            let command = `gh pr create --title "${title}"`;
            if (body) {
                command += ` --body "${body}"`;
            }
            if (base) {
                command += ` --base ${base}`;
            }
            
            const output = await this.executeGitHubCommand(
                command,
                'Creating pull request'
            );
            vscode.window.showInformationMessage('Pull request created successfully');
        } catch (error: any) {
            this.outputChannel.appendLine(`PR creation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Clone a repository
     */
    async cloneRepository(url: string, directory?: string): Promise<void> {
        const dirArg = directory ? ` ${directory}` : '';
        await this.executeGitHubCommand(
            `gh repo clone ${url}${dirArg}`,
            `Cloning repository: ${url}`
        );
        vscode.window.showInformationMessage(`Successfully cloned ${url}`);
    }

    /**
     * Fetch and apply a template
     */
    async fetchTemplate(templateRepo: string, targetPath?: string): Promise<void> {
        const tempDir = targetPath || 'template-temp';
        await this.executeGitHubCommand(
            `gh repo clone ${templateRepo} ${tempDir}`,
            `Fetching template from: ${templateRepo}`
        );
        vscode.window.showInformationMessage(`Template fetched to ${tempDir}`);
    }

    /**
     * Process natural language command for GitHub operations
     */
    async processNaturalLanguageCommand(input: string): Promise<void> {
        const lowerInput = input.toLowerCase();
        
        // Push operations
        if (lowerInput.includes('push') || lowerInput.includes('upload')) {
            await this.push();
        }
        // Pull operations
        else if (lowerInput.includes('pull') || lowerInput.includes('fetch') || lowerInput.includes('update')) {
            await this.pull();
        }
        // Branch creation
        else if (lowerInput.includes('create') && lowerInput.includes('branch')) {
            const branchName = await vscode.window.showInputBox({
                prompt: 'Enter branch name',
                placeHolder: 'feature/my-new-feature'
            });
            if (branchName) {
                await this.createBranch(branchName);
            }
        }
        // Pull request creation
        else if (lowerInput.includes('create') && (lowerInput.includes('pr') || lowerInput.includes('pull request'))) {
            const title = await vscode.window.showInputBox({
                prompt: 'Enter pull request title',
                placeHolder: 'Add new feature'
            });
            if (title) {
                const body = await vscode.window.showInputBox({
                    prompt: 'Enter pull request description (optional)',
                    placeHolder: 'Description of changes...'
                });
                await this.createPullRequest(title, body);
            }
        }
        // Clone repository
        else if (lowerInput.includes('clone')) {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter repository URL or owner/repo',
                placeHolder: 'owner/repository or https://github.com/owner/repo'
            });
            if (url) {
                await this.cloneRepository(url);
            }
        }
        // Fetch template
        else if (lowerInput.includes('template')) {
            const templateRepo = await vscode.window.showInputBox({
                prompt: 'Enter template repository',
                placeHolder: 'owner/template-repo'
            });
            if (templateRepo) {
                await this.fetchTemplate(templateRepo);
            }
        }
        else {
            vscode.window.showWarningMessage('Could not understand the command. Try: push, pull, create branch, create pr, clone, or template');
        }
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        this.outputChannel.dispose();
    }
}
