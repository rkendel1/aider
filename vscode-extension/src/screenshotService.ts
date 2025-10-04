import * as vscode from 'vscode';
import { AIProvider } from './providerManager';
import axios from 'axios';

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
        visionModel?: string,
        endpoint?: string,
        projectContext?: string
    ): Promise<ScreenshotCodeResult> {
        // Build prompt for screenshot analysis
        const prompt = this.buildScreenshotPrompt(screenshot, projectContext);
        
        // Call the appropriate provider's vision API
        let response: string;
        if (provider === AIProvider.Ollama && visionModel && endpoint) {
            response = await this.callOllamaVision(endpoint, visionModel, prompt, screenshot.dataUrl);
        } else {
            // Placeholder for other providers
            response = '// Generated code will appear here';
        }
        
        // Extract code from response
        const { code, language } = this.extractCodeFromResponse(response);
        const fileName = this.determineFileName(code, language);
        
        return {
            code,
            fileName,
            description: 'Generated from screenshot',
            language,
            provider
        };
    }

    /**
     * Call Ollama vision API
     */
    private async callOllamaVision(
        endpoint: string,
        model: string,
        prompt: string,
        imageDataUrl: string
    ): Promise<string> {
        try {
            // Extract base64 image data from data URL
            const base64Data = imageDataUrl.split(',')[1];
            
            // Call Ollama API with vision support
            const response = await axios.post(`${endpoint}/api/generate`, {
                model: model,
                prompt: prompt,
                images: [base64Data],
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 2048
                }
            }, {
                timeout: 120000 // 2 minute timeout for vision analysis
            });

            return response.data.response || '';
        } catch (error) {
            console.error('Ollama vision API error:', error);
            throw new Error(`Failed to analyze screenshot with Ollama: ${error}`);
        }
    }

    /**
     * Build AI prompt for screenshot analysis
     */
    private buildScreenshotPrompt(screenshot: ScreenshotData, projectContext?: string): string {
        let prompt = 'Analyze this screenshot and generate the corresponding React/Next.js component code.\n\n';
        
        if (projectContext) {
            prompt += '=== PROJECT CONTEXT ===\n';
            prompt += projectContext + '\n\n';
        }

        prompt += '=== REQUIREMENTS ===\n';
        prompt += '- Generate a complete, production-ready React component\n';
        prompt += '- Use modern React/Next.js best practices with functional components and hooks\n';
        prompt += '- Include proper TypeScript types and interfaces\n';
        prompt += '- Follow the project context rules and design principles if provided\n';
        prompt += '- Make the component responsive and accessible (ARIA labels, semantic HTML)\n';
        prompt += '- Use Tailwind CSS for styling (utility classes)\n';
        prompt += '- Match the visual design, layout, colors, and spacing from the screenshot as closely as possible\n';
        prompt += '- Include all text content visible in the screenshot\n';
        prompt += '- Export the component as a default export\n\n';
        
        prompt += '=== OUTPUT FORMAT ===\n';
        prompt += 'Provide ONLY the code in a single code block with no additional explanation.\n';
        prompt += 'Use this exact format:\n';
        prompt += '```typescript\n';
        prompt += '// Your component code here\n';
        prompt += '```\n';

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
