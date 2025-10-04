import * as assert from 'assert';
import * as vscode from 'vscode';
import { AiderClient } from '../../aiderClient';

suite('AiderClient Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('AiderClient initialization', () => {
        const client = new AiderClient('http://localhost:8501');
        assert.ok(client, 'Client should be initialized');
    });

    test('AiderClient healthCheck returns boolean', async () => {
        const client = new AiderClient('http://localhost:8501');
        const result = await client.healthCheck();
        assert.strictEqual(typeof result, 'boolean', 'Health check should return a boolean');
    });
});

suite('Extension Test Suite', () => {
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('aider.aider-vscode'));
    });

    test('Should activate extension', async () => {
        const ext = vscode.extensions.getExtension('aider.aider-vscode');
        if (ext) {
            await ext.activate();
            assert.ok(true);
        }
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        const aiderCommands = [
            'aider.startChat',
            'aider.sendMessage',
            'aider.addFile',
            'aider.removeFile',
            'aider.clearChat',
            'aider.undoChanges',
            'aider.showDiff',
            'aider.setPreviewUrl',
            'aider.pasteToChat',
            'aider.uploadScreenshot',
            'aider.pasteScreenshot',
            'aider.viewProjectContext',
            'aider.editProjectContext'
        ];

        for (const cmd of aiderCommands) {
            assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
        }
    });
});
