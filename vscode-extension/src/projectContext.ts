import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for project-specific context and rules
 */
export interface ProjectContext {
    rules: string[];
    designPrinciples: string[];
    goals: string[];
    codingPatterns: Record<string, string>;
    framework?: string;
    lastUpdated: string;
}

/**
 * Manages project-level context storage and retrieval
 */
export class ProjectContextManager {
    private static readonly CONTEXT_DIR = '.aider';
    private static readonly CONTEXT_FILE = 'project-context.json';
    private context: ProjectContext | null = null;
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    /**
     * Initialize context directory and load existing context
     */
    async initialize(): Promise<void> {
        const contextDir = path.join(this.workspaceRoot, ProjectContextManager.CONTEXT_DIR);
        
        // Create .aider directory if it doesn't exist
        if (!fs.existsSync(contextDir)) {
            fs.mkdirSync(contextDir, { recursive: true });
        }

        // Load or create context file
        await this.loadContext();
    }

    /**
     * Load project context from file
     */
    async loadContext(): Promise<ProjectContext> {
        const contextPath = this.getContextPath();
        
        if (fs.existsSync(contextPath)) {
            try {
                const content = fs.readFileSync(contextPath, 'utf8');
                this.context = JSON.parse(content);
                return this.context!;
            } catch (error) {
                console.error('Failed to load project context:', error);
                // Fall through to create default context
            }
        }

        // Create default context
        this.context = this.createDefaultContext();
        await this.saveContext();
        return this.context;
    }

    /**
     * Save project context to file
     */
    async saveContext(): Promise<void> {
        if (!this.context) {
            return;
        }

        this.context.lastUpdated = new Date().toISOString();
        const contextPath = this.getContextPath();
        
        try {
            fs.writeFileSync(contextPath, JSON.stringify(this.context, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save project context:', error);
            throw new Error(`Failed to save project context: ${error}`);
        }
    }

    /**
     * Get current project context
     */
    getContext(): ProjectContext | null {
        return this.context;
    }

    /**
     * Update project context
     */
    async updateContext(updates: Partial<ProjectContext>): Promise<void> {
        if (!this.context) {
            this.context = this.createDefaultContext();
        }

        this.context = { ...this.context, ...updates };
        await this.saveContext();
    }

    /**
     * Add a rule to the project context
     */
    async addRule(rule: string): Promise<void> {
        if (!this.context) {
            await this.loadContext();
        }

        if (!this.context!.rules.includes(rule)) {
            this.context!.rules.push(rule);
            await this.saveContext();
        }
    }

    /**
     * Add a design principle to the project context
     */
    async addDesignPrinciple(principle: string): Promise<void> {
        if (!this.context) {
            await this.loadContext();
        }

        if (!this.context!.designPrinciples.includes(principle)) {
            this.context!.designPrinciples.push(principle);
            await this.saveContext();
        }
    }

    /**
     * Add a coding pattern to the project context
     */
    async addCodingPattern(name: string, pattern: string): Promise<void> {
        if (!this.context) {
            await this.loadContext();
        }

        this.context!.codingPatterns[name] = pattern;
        await this.saveContext();
    }

    /**
     * Get context as a formatted string for AI prompts
     */
    getContextAsPrompt(): string {
        if (!this.context) {
            return '';
        }

        let prompt = 'PROJECT CONTEXT:\n\n';

        if (this.context.framework) {
            prompt += `Framework: ${this.context.framework}\n\n`;
        }

        if (this.context.rules.length > 0) {
            prompt += 'Project Rules:\n';
            this.context.rules.forEach(rule => {
                prompt += `- ${rule}\n`;
            });
            prompt += '\n';
        }

        if (this.context.designPrinciples.length > 0) {
            prompt += 'Design Principles:\n';
            this.context.designPrinciples.forEach(principle => {
                prompt += `- ${principle}\n`;
            });
            prompt += '\n';
        }

        if (this.context.goals.length > 0) {
            prompt += 'Project Goals:\n';
            this.context.goals.forEach(goal => {
                prompt += `- ${goal}\n`;
            });
            prompt += '\n';
        }

        if (Object.keys(this.context.codingPatterns).length > 0) {
            prompt += 'Coding Patterns:\n';
            Object.entries(this.context.codingPatterns).forEach(([name, pattern]) => {
                prompt += `- ${name}: ${pattern}\n`;
            });
            prompt += '\n';
        }

        return prompt;
    }

    /**
     * Validate code against project rules
     */
    validateAgainstRules(code: string): { valid: boolean; violations: string[] } {
        if (!this.context || this.context.rules.length === 0) {
            return { valid: true, violations: [] };
        }

        const violations: string[] = [];
        // Simple rule validation - can be enhanced with more sophisticated checks
        
        // Example rule checks (can be customized)
        this.context.rules.forEach(rule => {
            const lowerRule = rule.toLowerCase();
            const lowerCode = code.toLowerCase();

            if (lowerRule.includes('no inline styles') && lowerCode.includes('style=')) {
                violations.push(`Violates rule: ${rule}`);
            }
            
            if (lowerRule.includes('use typescript') && !code.includes('interface') && !code.includes('type')) {
                // This is a simple heuristic - may have false positives
                if (code.includes('function') || code.includes('const')) {
                    violations.push(`Violates rule: ${rule} (consider adding types)`);
                }
            }
        });

        return { valid: violations.length === 0, violations };
    }

    private getContextPath(): string {
        return path.join(
            this.workspaceRoot,
            ProjectContextManager.CONTEXT_DIR,
            ProjectContextManager.CONTEXT_FILE
        );
    }

    private createDefaultContext(): ProjectContext {
        return {
            rules: [],
            designPrinciples: [],
            goals: [],
            codingPatterns: {},
            lastUpdated: new Date().toISOString()
        };
    }
}
