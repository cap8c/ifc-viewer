import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin, NavCubePlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";
import { setupUI } from './uiHandlers.js';

export function setupViewer(canvasId) {
    // Initialize the viewer
    const viewer = new Viewer({ canvasId, transparent: true });
    viewer.camera.eye = [-2.56, 8.38, 8.27];
    viewer.camera.look = [13.44, 3.31, -14.83];
    viewer.camera.up = [0.10, 0.98, -0.14];

    // Add the NavCube plugin
    const navCube = new NavCubePlugin(viewer, {
        canvasId: "myNavCubeCanvas",
        visible: true,
        cameraFly: true,
        cameraFitFOV: 45,
        cameraFlyDuration: 0.5,
        fitVisible: false,
        synchProjection: false
    });

    // Initialize WebIFC
    const ifcAPI = new WebIFC.IfcAPI();
    ifcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

    // Load the IFC model
    ifcAPI.Init().then(() => {
        const ifcLoader = new WebIFCLoaderPlugin(viewer, { WebIFC, IfcAPI: ifcAPI });

        const model = ifcLoader.load({
            src: "RST_basic_sample_project.ifc",
            edges: true,
        });

        // When the model is loaded, set up the camera and tree view
        model.on("loaded", () => {
            console.log("Model loaded successfully.");
            viewer.cameraFlight.flyTo({ aabb: model.aabb });  // Fly the camera to fit the model

            const treeView = new TreeViewPlugin(viewer, {
                containerElement: document.getElementById("treeViewContainer"),
                autoExpandDepth: 1,
                groupTypes: true
            });

            setupUI(viewer, treeView);
        });

        // Error handling for model loading
        model.on("error", (error) => {
            console.error("Error loading IFC model:", error);
        });

    }).catch((error) => {
        console.error("Error initializing IFC API:", error);
    });

    return viewer;
}
