/**
 * AI Provider types supported by Aider
 */
export enum AIProvider {
    Ollama = 'ollama',
    Copilot = 'copilot',
    Default = 'default'
}

/**
 * Configuration for an AI provider
 */
export interface ProviderConfig {
    type: AIProvider;
    name: string;
    endpoint?: string;
    model?: string;
    visionModel?: string;
    enabled: boolean;
    supportsVision?: boolean;
}

/**
 * Manages AI provider selection and configuration
 */
export class ProviderManager {
    private currentProvider: AIProvider;
    private providers: Map<AIProvider, ProviderConfig>;

    constructor() {
        this.currentProvider = AIProvider.Default;
        this.providers = new Map();
        
        // Initialize default providers
        this.providers.set(AIProvider.Default, {
            type: AIProvider.Default,
            name: 'Default',
            enabled: true
        });
        
        this.providers.set(AIProvider.Ollama, {
            type: AIProvider.Ollama,
            name: 'Ollama',
            endpoint: 'http://localhost:11434',
            enabled: false
        });
        
        this.providers.set(AIProvider.Copilot, {
            type: AIProvider.Copilot,
            name: 'GitHub Copilot',
            enabled: false
        });
    }

    /**
     * Get the currently active provider
     */
    getCurrentProvider(): AIProvider {
        return this.currentProvider;
    }

    /**
     * Set the active provider
     */
    setCurrentProvider(provider: AIProvider): void {
        if (this.providers.has(provider)) {
            this.currentProvider = provider;
        }
    }

    /**
     * Get configuration for a specific provider
     */
    getProviderConfig(provider: AIProvider): ProviderConfig | undefined {
        return this.providers.get(provider);
    }

    /**
     * Update provider configuration
     */
    updateProviderConfig(provider: AIProvider, config: Partial<ProviderConfig>): void {
        const currentConfig = this.providers.get(provider);
        if (currentConfig) {
            this.providers.set(provider, { ...currentConfig, ...config });
        }
    }

    /**
     * Get all available providers
     */
    getAvailableProviders(): ProviderConfig[] {
        return Array.from(this.providers.values()).filter(p => p.enabled);
    }

    /**
     * Get all providers (including disabled)
     */
    getAllProviders(): ProviderConfig[] {
        return Array.from(this.providers.values());
    }

    /**
     * Enable or disable a provider
     */
    setProviderEnabled(provider: AIProvider, enabled: boolean): void {
        const config = this.providers.get(provider);
        if (config) {
            config.enabled = enabled;
        }
    }

    /**
     * Analyze query complexity (simple heuristic for now)
     * Returns recommended provider based on complexity
     */
    analyzeQueryComplexity(query: string): AIProvider {
        const lowercaseQuery = query.toLowerCase();
        
        // Simple queries suitable for Ollama
        const simplePatterns = [
            /^(add|create|generate)\s+(a\s+)?simple/i,
            /^(fix|update|change)\s+\w+\s+(in|to)/i,
            /^(what|how|why|when|where)\s+is/i,
            /boilerplate/i,
            /template/i,
            /comment/i,
        ];

        // Complex queries better for Copilot
        const complexPatterns = [
            /refactor/i,
            /architecture/i,
            /optimize/i,
            /security/i,
            /performance/i,
            /complex/i,
            /design pattern/i,
            /algorithm/i,
        ];

        // Check for complex patterns first
        for (const pattern of complexPatterns) {
            if (pattern.test(query)) {
                return AIProvider.Copilot;
            }
        }

        // Check for simple patterns
        for (const pattern of simplePatterns) {
            if (pattern.test(query)) {
                return AIProvider.Ollama;
            }
        }

        // Query length heuristic
        const wordCount = query.split(/\s+/).length;
        const charCount = query.length;

        // Short queries -> Ollama
        if (wordCount < 10 && charCount < 100) {
            return AIProvider.Ollama;
        }

        // Long, detailed queries -> Copilot
        if (wordCount > 30 || charCount > 200) {
            return AIProvider.Copilot;
        }

        // Default to current provider
        return this.currentProvider;
    }

    /**
     * Get vision-capable model for a provider
     */
    getVisionModel(provider: AIProvider): string | undefined {
        const config = this.providers.get(provider);
        return config?.visionModel;
    }

    /**
     * Check if a provider supports vision tasks
     */
    supportsVision(provider: AIProvider): boolean {
        const config = this.providers.get(provider);
        return config?.supportsVision || false;
    }

    /**
     * Get the best provider for vision tasks (screenshot analysis)
     */
    getVisionProvider(): AIProvider {
        // Check if Ollama is enabled and has vision support
        const ollamaConfig = this.providers.get(AIProvider.Ollama);
        if (ollamaConfig?.enabled && ollamaConfig?.supportsVision && ollamaConfig?.visionModel) {
            return AIProvider.Ollama;
        }

        // Fall back to Copilot if enabled
        const copilotConfig = this.providers.get(AIProvider.Copilot);
        if (copilotConfig?.enabled) {
            return AIProvider.Copilot;
        }

        // Fall back to default
        return AIProvider.Default;
    }
}
