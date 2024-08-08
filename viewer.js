import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

// Initialize the Viewer
const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

// Add the TreeViewPlugin
const treeView = new TreeViewPlugin(viewer, {
    containerElement: document.getElementById("myTreeViewContainer")
});

// Initialize the IfcAPI
const IfcAPI = new WebIFC.IfcAPI();
IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

IfcAPI.Init().then(() => {
    // Add the WebIFCLoaderPlugin
    const ifcLoader = new WebIFCLoaderPlugin(viewer, {
        WebIFC,
        IfcAPI
    });

    // Load the IFC model
    const model = ifcLoader.load({
        id: "myModel",
        src: "RST_basic_sample_project.ifc",  // Make sure this path is correct
        excludeTypes: ["IfcSpace"],
        edges: true
    });

    model.on("loaded", () => {
        console.log("Model loaded successfully:", model);
        treeView.addModel(model);

        // Set camera position to fit the loaded model
        const scene = viewer.scene;
        const camera = scene.camera;
        camera.eye = [-2.37, 18.97, -26.12];
        camera.look = [10.97, 5.82, -11.22];
        camera.up = [0.36, 0.83, 0.40];
    });

    model.on("error", (error) => {
        console.error("Error loading IFC model:", error);
    });
}).catch((error) => {
    console.error("Error initializing IfcAPI:", error);
});

// Debugging: Check Network Requests
window.addEventListener('load', () => {
    console.log('Page loaded. Checking network requests for IFC model.');
    fetch('RST_basic_sample_project.ifc')
        .then(response => {
            if (response.ok) {
                console.log('IFC model loaded successfully:', response);
            } else {
                console.error('Failed to load IFC model:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching IFC model:', error);
        });
});
