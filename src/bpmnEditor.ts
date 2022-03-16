import * as vscode from "vscode";

export class BpmnEditor implements vscode.CustomTextEditorProvider {
	public register(context: vscode.ExtensionContext) {}

	resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
		
	}	
}