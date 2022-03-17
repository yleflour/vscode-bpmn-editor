import { WebviewApi } from "vscode-webview";

interface State {
  content?: string;
  rootNodeId?: string;
}

export class CodeApiManager {
  private vscode: WebviewApi<State>;

  public constructor() {
    this.vscode = acquireVsCodeApi();
  }

  public get state(): State {
    return this.vscode.getState() ?? {};
  }

  public set state(state: State) {
    this.vscode.setState(state);
  }

  public updateState(state: Partial<State>) {
    this.vscode.setState({
      ...this.state,
      state,
    });
  }

  public sendUpdateXML(xml: string) {
    this.vscode.postMessage({
      type: "updateXML",
      text: xml,
    });
  }
}
