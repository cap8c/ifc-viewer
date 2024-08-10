import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

export function setupViewer(canvasId) {
  const viewer = new Viewer({ canvasId, transparent: true });
  viewer.camera.eye = [-2.56, 8.38, 8.27];
  viewer.camera.look = [13.44, 3.31, -14.83];
  viewer.camera.up = [0.10, 0.98, -0.14];

  const IfcAPI = new WebIFC.IfcAPI();
  IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

  IfcAPI.Init().then(() => {
    const ifcLoader = new WebIFCLoaderPlugin(viewer, { WebIFC, IfcAPI });

    const model = ifcLoader.load({
      id: "myModel",
      src: "RST_basic_sample_project.ifc",
      excludeTypes: ["IfcSpace"],
      edges: true,
    });

    const treeView = new TreeViewPlugin(viewer, {
      containerElement: document.getElementById("treeViewContainer"),
      autoExpandDepth: 1,
      groupTypes: true,
      groupLevels: true
    });

    model.on("loaded", () => {
      viewer.cameraFlight.flyTo({ aabb: model.aabb });

      // Add basic light (without shadows)
      viewer.scene.createLight({
        type: "dir", // Directional light
        dir: [0.5, -1, 0.5],
        color: [1.0, 1.0, 1.0],
        intensity: 0.8
      });
    });

    model.on("error", (error) => {
      console.error("Error loading IFC model:", error);
    });
  }).catch((error) => {
    console.error("Error initializing IfcAPI:", error);
  });

  return viewer;
}
