import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

// Initialize the viewer
const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

// Set the camera position
viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

// Initialize the tree view plugin
const treeView = new TreeViewPlugin(viewer, {
    containerElement: document.getElementById("myTreeViewContainer")
});

// Initialize the IFC API and loader
const ifcAPI = new WebIFC.IfcAPI();
ifcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

ifcAPI.Init().then(() => {
    const ifcLoader = new WebIFCLoaderPlugin(viewer, { WebIFC, IfcAPI: ifcAPI });

    const model = ifcLoader.load({
        id: "myModel",
        src: "RST_basic_sample_project.ifc", // Path to the IFC file
        edges: true
    });

    model.on("loaded", (modelInstance) => {
        console.log("IFC model loaded successfully");
        viewer.scene.cameraFlight.flyTo(modelInstance.aabb); // Fly to the model's bounding box
        treeView.build(modelInstance); // Build the tree view from the model
    });

    model.on("error", (error) => {
        console.error("Error loading IFC model:", error);
    });
}).catch(error => console.error("Error initializing IFC API:", error));
