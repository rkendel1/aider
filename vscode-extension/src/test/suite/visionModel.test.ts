import * as assert from 'assert';
import { ProviderManager, AIProvider, ProviderConfig } from '../../providerManager';
import { ScreenshotService } from '../../screenshotService';

suite('Vision Model Integration Test Suite', () => {
    test('ProviderManager should support vision models', () => {
        const manager = new ProviderManager();
        
        // Update Ollama config with vision model
        manager.updateProviderConfig(AIProvider.Ollama, {
            visionModel: 'llama3.2-vision',
            supportsVision: true
        });

        const config = manager.getProviderConfig(AIProvider.Ollama);
        assert.ok(config, 'Ollama config should exist');
        assert.strictEqual(config?.visionModel, 'llama3.2-vision', 'Vision model should be set');
        assert.strictEqual(config?.supportsVision, true, 'Should support vision');
    });

    test('ProviderManager should identify vision-capable providers', () => {
        const manager = new ProviderManager();
        
        // Configure Ollama with vision support
        manager.setProviderEnabled(AIProvider.Ollama, true);
        manager.updateProviderConfig(AIProvider.Ollama, {
            visionModel: 'llama3.2-vision',
            supportsVision: true
        });

        assert.strictEqual(manager.supportsVision(AIProvider.Ollama), true, 'Ollama should support vision');
        assert.strictEqual(manager.supportsVision(AIProvider.Copilot), false, 'Copilot config has no vision flag');
    });

    test('ProviderManager should return vision provider', () => {
        const manager = new ProviderManager();
        
        // Configure Ollama as vision provider
        manager.setProviderEnabled(AIProvider.Ollama, true);
        manager.updateProviderConfig(AIProvider.Ollama, {
            visionModel: 'llama3.2-vision',
            supportsVision: true,
            endpoint: 'http://localhost:11434'
        });

        const visionProvider = manager.getVisionProvider();
        assert.strictEqual(visionProvider, AIProvider.Ollama, 'Should return Ollama as vision provider');
    });

    test('ProviderManager should fall back when no vision provider available', () => {
        const manager = new ProviderManager();
        
        // Disable Ollama
        manager.setProviderEnabled(AIProvider.Ollama, false);
        
        // Enable Copilot
        manager.setProviderEnabled(AIProvider.Copilot, true);

        const visionProvider = manager.getVisionProvider();
        assert.strictEqual(visionProvider, AIProvider.Copilot, 'Should fall back to Copilot');
    });

    test('ProviderManager should get vision model for provider', () => {
        const manager = new ProviderManager();
        
        manager.updateProviderConfig(AIProvider.Ollama, {
            visionModel: 'llama3.2-vision'
        });

        const visionModel = manager.getVisionModel(AIProvider.Ollama);
        assert.strictEqual(visionModel, 'llama3.2-vision', 'Should return correct vision model');
    });

    test('ScreenshotService should validate screenshot data', () => {
        const service = new ScreenshotService();
        
        // Valid screenshot
        const validScreenshot = {
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            timestamp: Date.now()
        };

        const validResult = service.validateScreenshot(validScreenshot);
        assert.strictEqual(validResult.valid, true, 'Valid screenshot should pass validation');

        // Invalid screenshot - missing data URL
        const invalidScreenshot1 = {
            dataUrl: '',
            timestamp: Date.now()
        };

        const invalidResult1 = service.validateScreenshot(invalidScreenshot1);
        assert.strictEqual(invalidResult1.valid, false, 'Empty data URL should fail validation');
        assert.ok(invalidResult1.error, 'Should have error message');

        // Invalid screenshot - wrong format
        const invalidScreenshot2 = {
            dataUrl: 'not-a-data-url',
            timestamp: Date.now()
        };

        const invalidResult2 = service.validateScreenshot(invalidScreenshot2);
        assert.strictEqual(invalidResult2.valid, false, 'Invalid format should fail validation');
    });

    test('ScreenshotService should extract code from response', () => {
        const service = new ScreenshotService();
        
        const response = `
Here's the component code:

\`\`\`typescript
export default function Button() {
  return <button>Click me</button>;
}
\`\`\`

This is a simple button component.
        `;

        const result = service.extractCodeFromResponse(response);
        assert.strictEqual(result.language, 'typescript', 'Should detect TypeScript language');
        assert.ok(result.code.includes('export default function Button'), 'Should extract code content');
        assert.ok(!result.code.includes('```'), 'Should remove markdown code fences');
    });

    test('ScreenshotService should determine file name from code', () => {
        const service = new ScreenshotService();
        
        const code1 = 'export default function MyComponent() { return null; }';
        const fileName1 = service.determineFileName(code1, 'typescript');
        assert.strictEqual(fileName1, 'MyComponent.tsx', 'Should extract component name');

        const code2 = 'export const Header = () => { return null; }';
        const fileName2 = service.determineFileName(code2, 'typescript');
        assert.strictEqual(fileName2, 'Header.tsx', 'Should extract const component name');

        const code3 = 'const foo = "bar";';
        const fileName3 = service.determineFileName(code3, 'javascript');
        assert.ok(fileName3.startsWith('GeneratedComponent-'), 'Should use fallback name');
        assert.ok(fileName3.endsWith('.jsx'), 'Should use correct extension');
    });

    test('ProviderConfig interface should support all required fields', () => {
        const config: ProviderConfig = {
            type: AIProvider.Ollama,
            name: 'Ollama',
            endpoint: 'http://localhost:11434',
            model: 'llama2',
            visionModel: 'llama3.2-vision',
            enabled: true,
            supportsVision: true
        };

        assert.strictEqual(config.type, AIProvider.Ollama, 'Type should be set');
        assert.strictEqual(config.name, 'Ollama', 'Name should be set');
        assert.strictEqual(config.endpoint, 'http://localhost:11434', 'Endpoint should be set');
        assert.strictEqual(config.model, 'llama2', 'Model should be set');
        assert.strictEqual(config.visionModel, 'llama3.2-vision', 'Vision model should be set');
        assert.strictEqual(config.enabled, true, 'Enabled should be set');
        assert.strictEqual(config.supportsVision, true, 'Supports vision should be set');
    });
});
