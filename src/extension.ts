import * as vscode from 'vscode';
import { BpmnEditor } from './bpmnEditor';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(BpmnEditor.register(context));
	console.log('BPMN Editor is now active');
}
