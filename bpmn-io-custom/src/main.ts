// CSS
import "./style.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-color-picker/colors/color-picker.css";

// External Modules
import hotkeys from "hotkeys-js";
import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnColorPickerModule from "bpmn-js-color-picker";

// Libs
import { Navigator } from "./navigator";
import { ContentManager } from "./contentManager";

const modeler = new BpmnModeler({
  container: "#canvas",
  keyboard: { bindTo: document },
  additionalModules: [BpmnColorPickerModule],
});

const navigation = new Navigator(modeler);
const contentManager = new ContentManager(modeler);

navigation.setupNavigation();
contentManager.newDiagram().then(() => {
  navigation.updateRootElement();
});

hotkeys("ctrl+s, command+s", () => {
  contentManager.exportDiagram().then((xml) => {
    console.debug(xml);
  });
  return false;
});
