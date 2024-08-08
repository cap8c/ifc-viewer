import {Viewer, WebIFCLoaderPlugin, SectionPlane} from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

console.log("Initializing Viewer");
const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

console.log("Initializing IfcAPI");
const IfcAPI = new WebIFC.IfcAPI();

IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

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

    // Initialize Section Plane
    const sectionPlane = new SectionPlane(viewer.scene, {
      pos: [0, 0, 0],
      dir: [1, 0, 0]
    });

    // Add section plane to the scene
    viewer.scene.sectionPlanes = [sectionPlane];

    // Example of updating the section plane dynamically
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        sectionPlane.pos[0] += 0.1;
      } else if (event.key === 'ArrowLeft') {
        sectionPlane.pos[0] -= 0.1;
      }
    });

    viewer.scene.on("tick", () => {
      sectionPlane.update();
    });

    // Setup Tooltips
    const tooltip = document.getElementById('tooltip');

    viewer.scene.input.on("hover", (coords) => {
      const hit = viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true
      });

      if (hit) {
        const entityId = hit.entity.id;
        const metaModel = viewer.metaScene.metaModels["myModel"];
        const metaObject = metaModel.metaObjects[entityId];

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
      const hit = viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true
      });

      if (hit) {
        const entityId = hit.entity.id;
        console.log(`Entity ${entityId} selected`);
        viewer.scene.setObjectsXRayed(viewer.scene.objectIds, true);
        viewer.scene.setObjectsXRayed([entityId], false);

        const metaModel = viewer.metaScene.metaModels["myModel"];
        const metaObject = metaModel.metaObjects[entityId];

        if (metaObject) {
          console.log(`Entity ${entityId} selected`);
          console.log(`Name: ${metaObject.name}`);
          console.log(`Type: ${metaObject.type}`);
        }
      }
    });
  });

  model.on("error", (error) => {
    console.error("Error loading IFC model:", error);
  });
}).catch((error) => {
  console.error("Error initializing IfcAPI:", error);
});
