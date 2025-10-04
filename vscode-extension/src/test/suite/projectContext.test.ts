import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectContextManager, ProjectContext } from '../../projectContext';
import { ScreenshotService, ScreenshotData } from '../../screenshotService';

suite('ProjectContext Test Suite', () => {
    const testWorkspaceRoot = path.join(__dirname, '../../../test-workspace');

    setup(() => {
        // Create test workspace directory
        if (!fs.existsSync(testWorkspaceRoot)) {
            fs.mkdirSync(testWorkspaceRoot, { recursive: true });
        }
    });

    teardown(() => {
        // Clean up test files
        const contextDir = path.join(testWorkspaceRoot, '.aider');
        if (fs.existsSync(contextDir)) {
            const files = fs.readdirSync(contextDir);
            files.forEach(file => {
                fs.unlinkSync(path.join(contextDir, file));
            });
            fs.rmdirSync(contextDir);
        }
    });

    test('ProjectContextManager initialization', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        const context = manager.getContext();
        assert.ok(context, 'Context should be initialized');
        assert.ok(Array.isArray(context.rules), 'Rules should be an array');
        assert.ok(Array.isArray(context.designPrinciples), 'Design principles should be an array');
        assert.ok(Array.isArray(context.goals), 'Goals should be an array');
        assert.ok(typeof context.codingPatterns === 'object', 'Coding patterns should be an object');
    });

    test('Add rule to context', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addRule('Use TypeScript');
        const context = manager.getContext();
        
        assert.ok(context, 'Context should exist');
        assert.ok(context.rules.includes('Use TypeScript'), 'Rule should be added');
    });

    test('Add design principle to context', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addDesignPrinciple('Mobile-first design');
        const context = manager.getContext();
        
        assert.ok(context, 'Context should exist');
        assert.ok(context.designPrinciples.includes('Mobile-first design'), 'Principle should be added');
    });

    test('Add coding pattern to context', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addCodingPattern('API Calls', 'Use custom hooks');
        const context = manager.getContext();
        
        assert.ok(context, 'Context should exist');
        assert.strictEqual(context.codingPatterns['API Calls'], 'Use custom hooks', 'Pattern should be added');
    });

    test('Context persists to file', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addRule('Test Rule');
        await manager.saveContext();
        
        const contextPath = path.join(testWorkspaceRoot, '.aider', 'project-context.json');
        assert.ok(fs.existsSync(contextPath), 'Context file should exist');
        
        const fileContent = fs.readFileSync(contextPath, 'utf8');
        const savedContext = JSON.parse(fileContent);
        
        assert.ok(savedContext.rules.includes('Test Rule'), 'Rule should be persisted');
    });

    test('Get context as prompt', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addRule('Use TypeScript');
        await manager.addDesignPrinciple('Mobile-first');
        await manager.updateContext({ framework: 'React' });
        
        const prompt = manager.getContextAsPrompt();
        
        assert.ok(prompt.includes('PROJECT CONTEXT'), 'Prompt should have header');
        assert.ok(prompt.includes('React'), 'Prompt should include framework');
        assert.ok(prompt.includes('Use TypeScript'), 'Prompt should include rules');
        assert.ok(prompt.includes('Mobile-first'), 'Prompt should include principles');
    });

    test('Validate code against rules', async () => {
        const manager = new ProjectContextManager(testWorkspaceRoot);
        await manager.initialize();
        
        await manager.addRule('No inline styles');
        
        const codeWithInlineStyle = '<div style="color: red">Test</div>';
        const result = manager.validateAgainstRules(codeWithInlineStyle);
        
        assert.ok(!result.valid, 'Code with inline styles should be invalid');
        assert.ok(result.violations.length > 0, 'Should have violations');
    });
});

suite('ScreenshotService Test Suite', () => {
    const service = new ScreenshotService();

    test('Validate screenshot data URL', () => {
        const validScreenshot: ScreenshotData = {
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            timestamp: Date.now()
        };
        
        const result = service.validateScreenshot(validScreenshot);
        assert.ok(result.valid, 'Valid screenshot should pass validation');
    });

    test('Reject invalid screenshot data URL', () => {
        const invalidScreenshot: ScreenshotData = {
            dataUrl: 'not-a-valid-data-url',
            timestamp: Date.now()
        };
        
        const result = service.validateScreenshot(invalidScreenshot);
        assert.ok(!result.valid, 'Invalid screenshot should fail validation');
        assert.ok(result.error, 'Should have error message');
    });

    test('Extract code from markdown response', () => {
        const response = '```typescript\nconst x = 1;\n```';
        const result = service.extractCodeFromResponse(response);
        
        assert.strictEqual(result.language, 'typescript', 'Should extract language');
        assert.strictEqual(result.code.trim(), 'const x = 1;', 'Should extract code');
    });

    test('Extract code from plain text response', () => {
        const response = 'const x = 1;';
        const result = service.extractCodeFromResponse(response);
        
        assert.strictEqual(result.code, 'const x = 1;', 'Should return entire response as code');
    });

    test('Determine file name from component code', () => {
        const code = 'export default function MyComponent() { return <div />; }';
        const fileName = service.determineFileName(code, 'typescript');
        
        assert.ok(fileName.includes('MyComponent'), 'Should include component name');
        assert.ok(fileName.endsWith('.tsx'), 'Should have correct extension');
    });

    test('Determine file name from function code', () => {
        const code = 'export const MyFunction = () => { return null; }';
        const fileName = service.determineFileName(code, 'typescript');
        
        assert.ok(fileName.includes('MyFunction'), 'Should include function name');
    });

    test('Build screenshot prompt with context', () => {
        const screenshot: ScreenshotData = {
            dataUrl: 'data:image/png;base64,abc123',
            timestamp: Date.now()
        };
        
        const projectContext = 'PROJECT CONTEXT:\n\nFramework: React\n';
        // @ts-ignore - accessing private method for testing
        const prompt = service.buildScreenshotPrompt(screenshot, projectContext);
        
        assert.ok(prompt.includes('Analyze this screenshot'), 'Should have analysis instruction');
        assert.ok(prompt.includes('PROJECT CONTEXT'), 'Should include project context');
        assert.ok(prompt.includes('React'), 'Should include framework');
    });
});
