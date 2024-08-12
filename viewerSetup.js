import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin, NavCubePlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

export function setupViewer(canvasId) {
    // Initialize the viewer
    const viewer = new Viewer({
        canvasId,
        transparent: true, // Ensure transparency
        backgroundColor: [0, 0, 0, 0] // Fully transparent background
    });

    // Set initial camera position
    viewer.camera.eye = [-2.56, 8.38, 8.27];
    viewer.camera.look = [13.44, 3.31, -14.83];
    viewer.camera.up = [0.10, 0.98, -0.14];

    // Initialize WebIFC and load the model
    const ifcAPI = new WebIFC.IfcAPI();
    ifcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

    ifcAPI.Init().then(() => {
        const ifcLoader = new WebIFCLoaderPlugin(viewer, { WebIFC, IfcAPI: ifcAPI });

        const model = ifcLoader.load({
            src: "RST_basic_sample_project.ifc",
            edges: true,
        });

        model.on("loaded", () => {
            console.log("Model loaded successfully.");
            viewer.cameraFlight.flyTo({ aabb: model.aabb });

            // Initialize TreeViewPlugin
            const treeView = new TreeViewPlugin(viewer, {
                containerElement: document.getElementById("treeViewContainer"),
                autoExpandDepth: 1,
                groupTypes: true
            });

            // Add the model to the tree view
            treeView.addModel(model);

        });

        model.on("error", (error) => {
            console.error("Error loading IFC model:", error);
        });

    }).catch((error) => {
        console.error("Error initializing IFC API:", error);
    });

    return viewer;
}
