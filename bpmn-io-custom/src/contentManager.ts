import EMPTY_DIAGRAM_XML from "./empty.bpmn?raw";
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
      console.debug("[BPMN_Modeler] Rerendered diagram");

      if (warnings && warnings.length) console.warn(warnings);
    } catch (err) {
      console.error("[BPMN_Modeler] Error rendering", err);
      throw err;
    }
  }

  async exportDiagram(): Promise<string> {
    return (await this.modeler.saveXML({ format: true })).xml;
  }
}
