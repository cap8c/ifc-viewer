import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
import { setupUI } from './uiHandlers.js';

export function setupViewer(canvasId) {
    const viewer = new Viewer({ canvasId, transparent: true });
    viewer.camera.eye = [-2.56, 8.38, 8.27];
    viewer.camera.look = [13.44, 3.31, -14.83];
    viewer.camera.up = [0.10, 0.98, -0.14];

    const ifcLoader = new WebIFCLoaderPlugin(viewer, {
        src: "RST_basic_sample_project.ifc",
        edges: true,
    });

    const treeView = new TreeViewPlugin(viewer, {
        containerElement: document.getElementById("treeViewContainer"),
        autoExpandDepth: 1,
        groupTypes: true
    });

    viewer.on("sceneTick", () => {
        setupUI(); // Ensure UI is setup after viewer setup
    });

    return viewer;
}
