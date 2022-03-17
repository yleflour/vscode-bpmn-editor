import { CodeApiManager } from "./codeApiManager";

export class Navigator {
  private canvas: any;
  private eventBus: any;
  private rootNodeId: undefined | string;

  constructor(modeler, private readonly stateManager: CodeApiManager) {
    this.canvas = modeler.get("canvas");
    this.eventBus = modeler.get("eventBus");
  }

  public setupNavigation() {
    // Update from state on init
    const rootNodeId = this.stateManager.state.rootNodeId;
    if (rootNodeId) {
      this.rootNodeId = rootNodeId;
    }

    // Set root
    this.eventBus.on("root.set", this.setRootFromEvent.bind(this));
  }

  private setRootFromEvent(event) {
    const rootElement = event.element;
    if (rootElement.id === this.rootNodeId) return;

    console.debug("[Navigator] Root element set: ", this.rootNodeId);
    this.rootNodeId = rootElement.id;

    this.stateManager.updateState({ rootNodeId: this.rootNodeId });
  }

  public refreshRootElement() {
    console.debug("[Navigator] Refreshing Root Element", this.rootNodeId);
    if (this.rootNodeId)
      this.canvas.setRootElement(this.canvas.findRoot(this.rootNodeId));
  }
}
