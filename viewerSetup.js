import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";
import { setupUI } from './uiHandlers.js';

export function setupViewer(canvasId) {
    const viewer = new Viewer({ canvasId, transparent: true });
    viewer.camera.eye = [-2.56, 8.38, 8.27];
    viewer.camera.look = [13.44, 3.31, -14.83];
    viewer.camera.up = [0.10, 0.98, -0.14];

const navCube = new NavCubePlugin(viewer, {

    canvasID: "myNavCubeCanvas",

    visible: true,         // Initially visible (default)

    cameraFly: true,       // Fly camera to each selected axis/diagonal
    cameraFitFOV: 45,      // How much field-of-view the scene takes once camera has fitted it to view
    cameraFlyDuration: 0.5,// How long (in seconds) camera takes to fly to each new axis/diagonal

    fitVisible: false,     // Fit whole scene, including invisible objects (default)

    synchProjection: false // Keep NavCube in perspective projection, even when camera switches to ortho (default)
});

    const ifcAPI = new WebIFC.IfcAPI();
    ifcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

    ifcAPI.Init().then(() => {
        const ifcLoader = new WebIFCLoaderPlugin(viewer, { WebIFC, IfcAPI: ifcAPI });

        const model = ifcLoader.load({
            src: "RST_basic_sample_project.ifc",
            edges: true,
        });

        model.on("loaded", () => {
            viewer.cameraFlight.flyTo({ aabb: model.aabb });

            const treeView = new TreeViewPlugin(viewer, {
                containerElement: document.getElementById("treeViewContainer"),
                autoExpandDepth: 1,
                groupTypes: true
            });

            setupUI(viewer, treeView);  // Pass treeView to setupUI
        });

        model.on("error", (error) => {
            console.error("Error loading IFC model:", error);
        });

    }).catch((error) => {
        console.error("Error initializing IFC API:", error);
    });

    return viewer;
}
