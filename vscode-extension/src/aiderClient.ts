import axios, { AxiosInstance } from 'axios';
import { AIProvider } from './providerManager';

export interface AiderMessage {
    role: 'user' | 'assistant' | 'system' | 'info';
    content: string;
    provider?: AIProvider;
}

export interface AiderEdit {
    commit_hash?: string;
    commit_message?: string;
    diff?: string;
    fnames?: string[];
}

export interface AiderResponse {
    messages: AiderMessage[];
    edits?: AiderEdit[];
    files?: string[];
    provider?: AIProvider;
}

/**
 * Client for communicating with the Aider backend
 */
export class AiderClient {
    private httpClient: AxiosInstance;
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.httpClient = axios.create({
            baseURL: baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Send a message to Aider and get response
     */
    async sendMessage(message: string, provider?: AIProvider): Promise<AiderResponse> {
        try {
            const response = await this.httpClient.post('/api/chat', {
                message,
                role: 'user',
                provider: provider || AIProvider.Default
            });
            const data = response.data;
            
            // Add provider info to response if not present
            if (data && !data.provider) {
                data.provider = provider || AIProvider.Default;
            }
            
            return data;
        } catch (error: any) {
            console.error('Error sending message to Aider:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            } else if (error.response?.status === 404) {
                throw new Error('Aider API endpoint not found. Please check your backend configuration.');
            } else if (error.response?.status >= 500) {
                throw new Error(`Aider backend error: ${error.response?.data?.message || 'Internal server error'}`);
            }
            throw new Error(`Failed to send message: ${error.message || error}`);
        }
    }

    /**
     * Add a file to the chat context
     */
    async addFile(filePath: string): Promise<void> {
        try {
            await this.httpClient.post('/api/files/add', {
                file: filePath
            });
        } catch (error: any) {
            console.error('Error adding file to Aider:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to add file: ${error.message || error}`);
        }
    }

    /**
     * Remove a file from the chat context
     */
    async removeFile(filePath: string): Promise<void> {
        try {
            await this.httpClient.post('/api/files/remove', {
                file: filePath
            });
        } catch (error: any) {
            console.error('Error removing file from Aider:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to remove file: ${error.message || error}`);
        }
    }

    /**
     * Get list of files currently in chat
     */
    async getFiles(): Promise<string[]> {
        try {
            const response = await this.httpClient.get('/api/files');
            return response.data.files || [];
        } catch (error) {
            console.error('Error getting files from Aider:', error);
            return [];
        }
    }

    /**
     * Clear chat history
     */
    async clearChat(): Promise<void> {
        try {
            await this.httpClient.post('/api/chat/clear');
        } catch (error: any) {
            console.error('Error clearing chat:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to clear chat: ${error.message || error}`);
        }
    }

    /**
     * Undo last commit made by Aider
     */
    async undoLastCommit(): Promise<void> {
        try {
            await this.httpClient.post('/api/undo');
        } catch (error: any) {
            console.error('Error undoing commit:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to undo: ${error.message || error}`);
        }
    }

    /**
     * Get diff of changes since last message
     */
    async getDiff(): Promise<string> {
        try {
            const response = await this.httpClient.get('/api/diff');
            return response.data.diff || '';
        } catch (error: any) {
            console.error('Error getting diff:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to get diff: ${error.message || error}`);
        }
    }

    /**
     * Get chat history
     */
    async getChatHistory(): Promise<AiderMessage[]> {
        try {
            const response = await this.httpClient.get('/api/chat/history');
            return response.data.messages || [];
        } catch (error) {
            console.error('Error getting chat history:', error);
            return [];
        }
    }

    /**
     * Apply changes from Aider to files
     */
    async applyChanges(edit: AiderEdit): Promise<void> {
        try {
            await this.httpClient.post('/api/apply', edit);
        } catch (error: any) {
            console.error('Error applying changes:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error(`Cannot connect to Aider backend at ${this.baseUrl}. Please ensure the API server is running.`);
            }
            throw new Error(`Failed to apply changes: ${error.message || error}`);
        }
    }

    /**
     * Check if Aider backend is available
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.httpClient.get('/api/health');
            return true;
        } catch (error) {
            return false;
        }
    }
}
