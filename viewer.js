import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

const treeView = new TreeViewPlugin(viewer, {
  containerElement: document.getElementById("treeview")
});

const IfcAPI = new WebIFC.IfcAPI();

IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

IfcAPI.Init().then(() => {
  const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    WebIFC,
    IfcAPI
  });

  const model = ifcLoader.load({
    id: "myModel",
    src: "RST_basic_sample_project.ifc",  // Ensure this path is correct
    excludeTypes: ["IfcSpace"],
    edges: true
  });

  model.on("loaded", () => {
    console.log("IFC model loaded successfully");
    console.log("Loaded MetaModel:", viewer.metaScene.metaModels["myModel"]);
  });

  model.on("error", (error) => {
    console.error("Error loading IFC model:", error);
  });
}).catch((error) => {
  console.error("Error initializing IfcAPI:", error);
});

document.getElementById("selectButton").addEventListener("click", () => {
  viewer.scene.setPickable(viewer.scene.objectIds, true);
  viewer.scene.on("picked", (e) => {
    const objectId = e.entity.id;
    console.log("Picked object ID:", objectId);
  });
});

document.getElementById("toggleTreeView").addEventListener("click", () => {
  const treeViewDiv = document.getElementById("treeview");
  treeViewDiv.style.display = treeViewDiv.style.display === "none" ? "block" : "none";
});
