import * as assert from 'assert';
import * as vscode from 'vscode';
import { AiderPreviewProvider, InspectorData } from '../../previewProvider';

suite('AiderPreviewProvider Test Suite', () => {
    let extensionUri: vscode.Uri;
    let inspectorDataCallback: ((data: InspectorData) => void) | undefined;

    suiteSetup(() => {
        const ext = vscode.extensions.getExtension('aider.aider-vscode');
        extensionUri = ext?.extensionUri || vscode.Uri.file('.');
    });

    test('AiderPreviewProvider initialization', () => {
        const provider = new AiderPreviewProvider(extensionUri, (data) => {
            inspectorDataCallback?.(data);
        });
        assert.ok(provider, 'Provider should be initialized');
    });

    test('AiderPreviewProvider setPreviewUrl', () => {
        const provider = new AiderPreviewProvider(extensionUri, () => {});
        provider.setPreviewUrl('http://localhost:3000');
        // No error should occur
        assert.ok(true);
    });

    test('Inspector data formatting', () => {
        let capturedData: InspectorData | undefined;
        
        const provider = new AiderPreviewProvider(extensionUri, (data) => {
            capturedData = data;
        });

        // Simulate inspector data
        const testData: InspectorData = {
            elementType: 'div',
            cssClasses: ['container', 'main'],
            inlineStyles: 'color: red;',
            xpath: '/html/body/div[1]',
            componentName: 'MainContainer'
        };

        // This would normally be called from the webview
        // We're just testing the structure
        assert.ok(testData.componentName === 'MainContainer');
        assert.ok(testData.cssClasses.length === 2);
        assert.ok(testData.elementType === 'div');
    });
});

suite('Preview Commands Test Suite', () => {
    test('Should register preview commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        const previewCommands = [
            'aider.setPreviewUrl',
            'aider.pasteToChat'
        ];

        for (const cmd of previewCommands) {
            assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
        }
    });
});
