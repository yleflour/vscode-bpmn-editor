export class Navigator {
  private canvas: any;
  private eventBus: any;
  private search: URLSearchParams;
  private browserNavigationInProgress = false;

  constructor(modeler) {
    this.canvas = modeler.get("canvas");
    this.eventBus = modeler.get("eventBus");
    this.search = new URLSearchParams(window.location.search);
  }

  public setupNavigation() {
    this.eventBus.on("root.set", (event) => {
      // location is already updated through the browser history API
      if (this.browserNavigationInProgress) {
        return;
      }

      const rootElement = event.element;

      this.search.set("rootElement", rootElement.id);
      window.history.pushState(
        { element: rootElement.id },
        "",
        "index.html?" + this.search.toString()
      );
    });

    window.addEventListener("popstate", (event) => {
      const rootElement = event.state && event.state.element;

      if (!rootElement) {
        return;
      }

      this.browserNavigationInProgress = true;
      this.canvas.setRootElement(this.canvas.findRoot(rootElement));
      this.browserNavigationInProgress = false;
    });
  }

  public updateRootElement() {
    const root = this.search.get("rootElement");
    if (root) {
      this.canvas.setRootElement(this.canvas.findRoot(root));
    }
  }
}
