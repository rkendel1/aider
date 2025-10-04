import * as vscode from 'vscode';
import { AIProvider } from './providerManager';

/**
 * Interface for screenshot data
 */
export interface ScreenshotData {
    dataUrl: string;
    fileName?: string;
    timestamp: number;
}

/**
 * Interface for code generation result from screenshot
 */
export interface ScreenshotCodeResult {
    code: string;
    fileName: string;
    description: string;
    language: string;
    provider: AIProvider;
}

/**
 * Service for handling screenshot processing and code generation
 */
export class ScreenshotService {
    /**
     * Analyze screenshot and generate code using AI
     */
    async analyzeScreenshot(
        screenshot: ScreenshotData,
        provider: AIProvider,
        projectContext?: string
    ): Promise<ScreenshotCodeResult> {
        // This will integrate with the AI provider to analyze the screenshot
        // For now, we'll create a placeholder that can be connected to the actual AI service
        
        const prompt = this.buildScreenshotPrompt(screenshot, projectContext);
        
        // The actual implementation will call the AI service
        // For now, return a placeholder result
        return {
            code: '// Generated code will appear here',
            fileName: 'generated-component.tsx',
            description: 'Generated from screenshot',
            language: 'typescript',
            provider: provider
        };
    }

    /**
     * Build AI prompt for screenshot analysis
     */
    private buildScreenshotPrompt(screenshot: ScreenshotData, projectContext?: string): string {
        let prompt = 'Analyze this screenshot and generate the corresponding code.\n\n';
        
        if (projectContext) {
            prompt += projectContext + '\n\n';
        }

        prompt += 'Requirements:\n';
        prompt += '- Generate a complete, production-ready component\n';
        prompt += '- Use modern React/Next.js best practices\n';
        prompt += '- Include proper TypeScript types\n';
        prompt += '- Follow the project context rules and design principles\n';
        prompt += '- Make the component responsive and accessible\n';
        prompt += '- Use Tailwind CSS for styling if applicable\n\n';
        
        prompt += `Screenshot data: ${screenshot.dataUrl.substring(0, 100)}...\n`;

        return prompt;
    }

    /**
     * Extract code from AI response
     */
    extractCodeFromResponse(response: string): { code: string; language: string } {
        // Extract code blocks from markdown-style responses
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const matches = [...response.matchAll(codeBlockRegex)];

        if (matches.length > 0) {
            const firstMatch = matches[0];
            return {
                language: firstMatch[1] || 'typescript',
                code: firstMatch[2].trim()
            };
        }

        // If no code blocks found, return the entire response
        return {
            language: 'typescript',
            code: response.trim()
        };
    }

    /**
     * Determine file name based on code content
     */
    determineFileName(code: string, language: string): string {
        // Try to extract component name from code
        const componentMatch = code.match(/(?:export\s+(?:default\s+)?(?:function|const)\s+)(\w+)/);
        
        if (componentMatch) {
            const componentName = componentMatch[1];
            const extension = language === 'typescript' ? 'tsx' : 'jsx';
            return `${componentName}.${extension}`;
        }

        // Default fallback
        const extension = language === 'typescript' ? 'tsx' : 'jsx';
        return `GeneratedComponent-${Date.now()}.${extension}`;
    }

    /**
     * Validate screenshot data
     */
    validateScreenshot(screenshot: ScreenshotData): { valid: boolean; error?: string } {
        if (!screenshot.dataUrl) {
            return { valid: false, error: 'Screenshot data URL is required' };
        }

        if (!screenshot.dataUrl.startsWith('data:image/')) {
            return { valid: false, error: 'Invalid image data URL format' };
        }

        // Check size (basic validation)
        const sizeInBytes = (screenshot.dataUrl.length * 3) / 4;
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (sizeInBytes > maxSize) {
            return { valid: false, error: 'Screenshot size exceeds 10MB limit' };
        }

        return { valid: true };
    }
}
