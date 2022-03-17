import * as vscode from "vscode";

export class BpmnEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext) {
    const provider = new BpmnEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      BpmnEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "bpmnEditor.modeler";

  public constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Send document content to the webview
    function updateXML() {
      webviewPanel.webview.postMessage({
        type: "updateXML",
        text: document.getText(),
      });
    }

    function loadXML() {
      webviewPanel.webview.postMessage({
        type: "loadXML",
        text: document.getText(),
      });
    }

    // Document content change subscription
    const changeDocumentSubscription = vscode.workspace.onDidSaveTextDocument(
      (e) => {
        updateXML();
      }
    );

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Handle events from the webview
    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "updateXML":
          this.replaceDocument(document, e.text);
          return;
      }
    });

    loadXML();
  }

  private getNonce() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const indexUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "web-dist/assets/index.js")
    );
    const vendorsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "web-dist/assets/vendor.js"
      )
    );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "web-dist/assets/index.css"
      )
    );

    const nonce = this.getNonce();

    return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; font-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>BPMN Modeler</title>
				<script nonce="${nonce}" type="module" crossorigin src="${indexUri}"></script>
				<link nonce="${nonce}" rel="modulepreload" href="${vendorsUri}">
				<link rel="stylesheet" href="${cssUri}">
			</head>
			<body>
				<div id="canvas"></div>
				Hello World!
			</body>
		</html>
		`;
  }

  private replaceDocument(document: vscode.TextDocument, text: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      text
    );
    return vscode.workspace.applyEdit(edit);
  }
}
