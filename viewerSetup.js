// viewerSetup.js
import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";

export function setupViewer(canvasId) {
    const viewer = new Viewer({ canvasId, transparent: true });
    viewer.camera.eye = [-2.56, 8.38, 8.27];
    viewer.camera.look = [13.44, 3.31, -14.83];
    viewer.camera.up = [0.10, 0.98, -0.14];

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
