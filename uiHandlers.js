export function setupUI(viewer, treeView) {
    treeView.on("nodeTitleClicked", (e) => {
        const scene = viewer.scene;
        const objectIds = [];

        e.treeViewPlugin.withNodeTree(e.treeViewNode, (node) => {
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
}
