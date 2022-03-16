import EMPTY_DIAGRAM_XML from "./nested.bpmn?raw";

export class ContentManager {
  modeler: any;

  constructor(modeler) {
    this.modeler = modeler;
  }

  newDiagram() {
    return this.loadDiagram(EMPTY_DIAGRAM_XML);
  }

  async loadDiagram(content: string) {
    try {
      const { warnings } = await this.modeler.importXML(content);
      console.debug("rendered");

      if (warnings) console.warn(warnings);
    } catch (err) {
      console.log("error rendering", err);
    }
  }

  async exportDiagram(): Promise<string> {
    return (await this.modeler.saveXML({ format: true })).xml;
  }
}
