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

const treeView = new TreeViewPlugin(viewer, {
    containerElement: document.getElementById("myTreeViewContainer")
});

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
        treeView.expandToLevel(2);  // Adjust the expansion level as needed

        const scene = viewer.scene;
        const canvas = scene.canvas.canvas;
        const tooltip = document.createElement('div');

        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        const handlePick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const coords = [
                (e.clientX - rect.left) * (canvas.width / rect.width),
                (e.clientY - rect.top) * (canvas.height / rect.height)
            ];
            console.log('Click Coordinates:', coords);

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

        canvas.addEventListener('click', handlePick);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth - 300; // 300px for the tree view
            canvas.height = window.innerHeight;
            viewer.scene.canvas.resize();
        });
    });

    model.on("error", (error) => {
        console.error("Error loading IFC model:", error);
    });
}).catch((error) => {
    console.error("Error initializing IfcAPI:", error);
});

document.getElementById("selectButton").addEventListener('click', () => {
    console.log("Selection tool is now active");
    viewer.scene.input.keyboardEnabled = !viewer.scene.input.keyboardEnabled;
});
