import {Viewer, WebIFCLoaderPlugin, TreeViewPlugin} from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

console.log("Initializing Viewer");
const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

console.log("Initializing TreeViewPlugin");
const treeView = new TreeViewPlugin(viewer, {
  containerElement: document.getElementById("myTreeViewContainer")
});

console.log("Initializing IfcAPI");
const IfcAPI = new WebIFC.IfcAPI();

IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

let selectionToolActive = false;

IfcAPI.Init().then(() => {
  console.log("IfcAPI initialized");
  const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    WebIFC,
    IfcAPI
  });

  console.log("Loading IFC model");
  const model = ifcLoader.load({
    id: "myModel",
    src: "RST_basic_sample_project.ifc",  // Load the IFC file from the root directory
    excludeTypes: ["IfcSpace"],
    edges: true
  });

  model.on("loaded", () => {
    console.log("IFC model loaded successfully");

    // Add model to tree view
    treeView.addModel(model);
    console.log("Model added to TreeView");

    // Setup Tooltips
    const tooltip = document.getElementById('tooltip');

    viewer.scene.input.on("hover", (coords) => {
      const hit = viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true
      });

      if (hit) {
        const entityId = hit.entity.id;
        const metaObject = viewer.metaScene.metaObjects[entityId];

        if (metaObject) {
          tooltip.style.left = `${coords[0]}px`;
          tooltip.style.top = `${coords[1]}px`;
          tooltip.style.display = 'block';
          tooltip.innerHTML = `Name: ${metaObject.name}<br>Type: ${metaObject.type}`;
        }
      } else {
        tooltip.style.display = 'none';
      }
    });

    // Setup Object Selection
    viewer.scene.input.on("pick", (coords) => {
      if (selectionToolActive) {
        const hit = viewer.scene.pick({
          canvasPos: coords,
          pickSurface: true
        });

        if (hit) {
          const entityId = hit.entity.id;
          viewer.scene.setObjectsXRayed(viewer.scene.objectIds, true);
          viewer.scene.setObjectsXRayed([entityId], false);

          const metaObject = viewer.metaScene.metaObjects[entityId];

          if (metaObject) {
            console.log(`Entity ${entityId} selected`);
            console.log(`Name: ${metaObject.name}`);
            console.log(`Type: ${metaObject.type}`);
          }
        }
      }
    });

    // Toggle Selection Tool Button
    document.getElementById('toggleSelection').addEventListener('click', () => {
      selectionToolActive = !selectionToolActive;
      console.log(`Selection tool is now ${selectionToolActive ? 'active' : 'inactive'}`);
    });
  });

  model.on("error", (error) => {
    console.error("Error loading IFC model:", error);
  });
}).catch((error) => {
  console.error("Error initializing IfcAPI:", error);
});
