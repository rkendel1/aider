import * as assert from 'assert';
import * as vscode from 'vscode';
import { AiderPreviewPanel } from '../../previewPanel';

suite('AiderPreviewPanel Test Suite', () => {
    let extensionUri: vscode.Uri;

    suiteSetup(() => {
        const ext = vscode.extensions.getExtension('aider.aider-vscode');
        extensionUri = ext?.extensionUri || vscode.Uri.file('.');
    });

    test('AiderPreviewPanel creation', () => {
        const panel = AiderPreviewPanel.createOrShow(
            extensionUri,
            () => {},
            () => {},
            () => {}
        );
        assert.ok(panel, 'Panel should be created');
        assert.ok(AiderPreviewPanel.currentPanel, 'Current panel should be set');
        
        // Clean up
        panel.dispose();
    });

    test('AiderPreviewPanel singleton pattern', () => {
        const panel1 = AiderPreviewPanel.createOrShow(extensionUri, () => {}, () => {}, () => {});
        const panel2 = AiderPreviewPanel.createOrShow(extensionUri, () => {}, () => {}, () => {});
        
        assert.strictEqual(panel1, panel2, 'Should return same panel instance');
        
        // Clean up
        panel1.dispose();
    });

    test('AiderPreviewPanel disposal', () => {
        const panel = AiderPreviewPanel.createOrShow(extensionUri, () => {}, () => {}, () => {});
        assert.ok(AiderPreviewPanel.currentPanel, 'Panel should exist');
        
        panel.dispose();
        assert.strictEqual(AiderPreviewPanel.currentPanel, undefined, 'Panel should be cleared after disposal');
    });
});

suite('Preview Panel Commands Test Suite', () => {
    test('Should register preview panel commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        const previewCommands = [
            'aider.openPreviewPanel',
            'aider.refreshPreview',
            'aider.highlightElement',
            'aider.scrollToElement'
        ];

        for (const cmd of previewCommands) {
            assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
        }
    });
});
