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
import { CodeApiManager } from "./codeApiManager";

// Setup
const codeApi = new CodeApiManager();

const modeler = new BpmnModeler({
  container: "#canvas",
  keyboard: { bindTo: document },
  additionalModules: [BpmnColorPickerModule],
});

const navigation = new Navigator(modeler, codeApi);
const contentManager = new ContentManager(modeler);

navigation.setupNavigation();

// VSCode API listeners
window.addEventListener("message", async (event) => {
  const message = event.data; // The json data that the extension sent
  switch (message.type) {
    case "loadXML":
      openXML(message.text);
      return;
    case "updateXML":
      updateXML(message.text);
      return;
    default:
      console.warn("[BPMN_Modeler] Unknown message type: " + message);
  }
});

// Helpers
async function openXML(content) {
  console.debug("[BPMN_Modeler] Loading changes");

  if (!content) {
    console.debug("[BPMN_Modeler] Empty diagram, saving template");
    await contentManager.newDiagram();
    sendChanges();
  } else {
    await contentManager.loadDiagram(content);
  }

  // Persist state information.
  // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
  codeApi.updateState({ content });
}

async function updateXML(content) {
  navigation.skipNextRootUpdate();
  await contentManager.loadDiagram(content);
  navigation.refreshRootElement();

  // Persist state information.
  // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
  codeApi.updateState({ content });
}

function sendChanges() {
  console.debug("[BPMN_Modeler] Sending changes");

  contentManager.exportDiagram().then((text) => {
    codeApi.sendUpdateXML(text);
  });
}

// Auto save on XML Change
modeler.get("eventBus").on("commandStack.changed", sendChanges);

// Load current state information if exists
const state = codeApi.state;
if (state.content) {
  console.debug("[BPMN_Modeler] Loading from current state");
  openXML(state.content);
}
