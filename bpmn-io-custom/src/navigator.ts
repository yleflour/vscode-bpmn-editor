import { StateManager } from "./stateManager";

const DEBUG = false;

export class Navigator {
  private canvas: any;
  private eventBus: any;
  private rootNodeId: undefined | string;

  constructor(modeler, private readonly stateManager: StateManager) {
    this.canvas = modeler.get("canvas");
    this.eventBus = modeler.get("eventBus");
  }

  public startListeners() {
    DEBUG &&
      console.debug("[BPMN_Editor.Navigator] Starting root element listener");
    this.eventBus.on("root.set", this.setRootFromEvent.bind(this));
  }

  private setRootFromEvent(event) {
    const rootElement = event.element;
    DEBUG &&
      console.debug(
        "[BPMN_Editor.Navigator] Setting root element",
        rootElement
      );
    if (rootElement.id === this.rootNodeId) return;

    console.debug("[BPMN_Editor.Navigator] Root element set: ", rootElement.id);
    this.rootNodeId = rootElement.id;

    this.stateManager.updateState({ rootNodeId: rootElement.id });
  }

  public setRootNodeId(rootNodeId = "rootProcess") {
    this.rootNodeId = rootNodeId;
    this.refreshRootElement();
  }

  public refreshRootElement() {
    console.debug(
      "[BPMN_Editor.Navigator] Refreshing Root Element",
      this.rootNodeId
    );
    if (this.rootNodeId)
      this.canvas.setRootElement(this.canvas.findRoot(this.rootNodeId));
  }
}
