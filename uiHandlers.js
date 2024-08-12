export function setupUI(viewer, treeView) {
    if (treeView) {
        treeView.on("nodeTitleClicked", (e) => {
            const scene = viewer.scene;
            const objectIds = [];

            treeView.withNodeTree(e.treeViewNode, (node) => {
                if (node.objectId) {
                    objectIds.push(node.objectId);
                }
            });

            // X-ray all other objects
            scene.setObjectsXRayed(scene.objectIds, true);
            // Highlight and zoom to selected object
            scene.setObjectsXRayed(objectIds, false);
            viewer.cameraFlight.flyTo({
                aabb: scene.getAABB(objectIds),
                duration: 0.5,
            });
        });
    } else {
        console.error("TreeViewPlugin is not defined.");
    }
}
