import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";

const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

const treeViewContainer = document.getElementById("treeViewContainer");

const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    wasmPath: "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/"
});

const treeView = new TreeViewPlugin(viewer, {
    containerElement: treeViewContainer
});

ifcLoader.load({
    id: "myModel",
    src: "RST_basic_sample_project.ifc",  // Path to your IFC file
    edges: true
}).then(model => {
    console.log("IFC model loaded successfully");

    // Expand the tree view to show hierarchy
    treeView.buildDefaultTree();

    // Fly the camera to fit the model in view
    viewer.cameraFlight.flyTo({
        aabb: model.aabb
    });
});

const selectButton = document.getElementById("selectButton");
selectButton.addEventListener("click", () => {
    viewer.scene.setPickable(viewer.scene.objectIds, true);
    viewer.scene.input.on("picked", (e) => {
        const entity = viewer.scene.objects[e.entityId];
        if (entity) {
            console.log("Picked object ID:", entity.id);
            viewer.scene.setObjectHighlighted(entity.id, true);

            // Display tooltip
            const tooltip = document.createElement("div");
            tooltip.style.position = "absolute";
            tooltip.style.left = `${e.canvasPos[0]}px`;
            tooltip.style.top = `${e.canvasPos[1]}px`;
            tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            tooltip.style.color = "white";
            tooltip.style.padding = "5px";
            tooltip.style.borderRadius = "3px";
            tooltip.innerText = `ID: ${entity.id}`;
            document.body.appendChild(tooltip);

            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 2000);
        }
    });
});

const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
    const searchTerm = searchBox.value.toLowerCase();
    const filtered = treeView.filterNodes(node => node.title.toLowerCase().includes(searchTerm));

    if (filtered.length > 0) {
        viewer.cameraFlight.flyTo({
            aabb: viewer.scene.getAABB(filtered.map(node => node.id))
        });
    }
});
