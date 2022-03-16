// CSS
import "./style.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-color-picker/colors/color-picker.css";

// External Modules
import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnColorPickerModule from "bpmn-js-color-picker";

// Libs
import { Navigator } from "./navigator";
import { ContentManager } from "./contentManager";
import hotkeys from "hotkeys-js";

// Setup
const vscode = acquireVsCodeApi();

const modeler = new BpmnModeler({
  container: "#canvas",
  keyboard: { bindTo: document },
  additionalModules: [BpmnColorPickerModule],
});

const navigation = new Navigator(modeler);
const contentManager = new ContentManager(modeler);

navigation.setupNavigation();

// VSCode API listeners
window.addEventListener("message", async (event) => {
  const message = event.data; // The json data that the extension sent
  switch (message.type) {
    case "loadXMl":
      loadChanges(message.text);
      return;
    case "saveXML":
      saveChanges();
      return;
  }
});

// Helpers
async function loadChanges(content) {
  console.debug("[BPMN_Modeler] Loading changes");

  try {
    await contentManager.loadDiagram(content);
  } catch (error) {
    await contentManager.newDiagram();
    saveChanges();
  }

  // navigation.updateRootElement();

  // Persist state information.
  // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
  vscode.setState({ content });
}

function saveChanges() {
  console.debug("[BPMN_Modeler] Saving");

  contentManager.exportDiagram().then((text) => {
    vscode.postMessage({ type: "update", text });
  });
}

// Auto save on XML Change
modeler.get("eventBus").on("commandStack.changed", saveChanges);

// Keyboard save shortcuts
hotkeys("ctrl+s,cmd+s", () => {
  saveChanges();
});

// Load current state information if exists
const state = vscode.getState() as { content: string } | undefined;
if (state) {
  console.debug("[BPMN_Modeler] Loading from current state");
  loadChanges(state.content);
}
