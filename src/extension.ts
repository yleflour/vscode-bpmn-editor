import * as vscode from "vscode";
import { BpmnEditorProvider } from "./bpmnEditor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(BpmnEditorProvider.register(context));
  console.log("BPMN Editor is now active");
}
