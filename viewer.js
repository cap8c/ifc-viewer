import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

document.addEventListener("DOMContentLoaded", function() {
  const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
  });

  viewer.camera.eye = [-2.56, 8.38, 8.27];
  viewer.camera.look = [13.44, 3.31, -14.83];
  viewer.camera.up = [0.10, 0.98, -0.14];

  const treeView = new TreeViewPlugin(viewer, {
    containerElement: document.getElementById("treeViewContainer"),
    autoExpandDepth: 1
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
      src: "RST_basic_sample_project.ifc",
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
    const canvas = viewer.scene.canvas.canvas;
    const tooltip = document.getElementById("tooltip");

    const handlePick = (e) => {
      const coords = [e.clientX, e.clientY];
      const hit = viewer.scene.pick({
        canvasPos: coords
      });

      if (hit && hit.entity) {
        const objectId = hit.entity.id;
        console.log("Picked object ID:", objectId);
        
        viewer.scene.setObjectsHighlighted([objectId], true);
        viewer.scene.setObjectsHighlighted(viewer.scene.highlightedObjectIds.filter(id => id !== objectId), false);

        tooltip.innerText = `Object ID: ${objectId}`;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    };

    if (!viewer.selectionActive) {
      canvas.addEventListener("click", handlePick);
      viewer.selectionActive = true;
      console.log("Selection tool is now active");
    } else {
      canvas.removeEventListener("click", handlePick);
      viewer.selectionActive = false;
      console.log("Selection tool is now inactive");
      tooltip.style.display = 'none';
    }
  });

  document.getElementById("toggleTreeView").addEventListener("click", () => {
    const treeViewDiv = document.getElementById("treeViewContainer");
    treeViewDiv.style.display = treeViewDiv.style.display === "none" ? "block" : "none";
  });
});
