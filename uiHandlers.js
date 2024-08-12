export function setupUI(viewer, treeView) {
    treeView.on("nodeTitleClicked", (e) => {
        const scene = viewer.scene;
        const objectIds = [];

        // Deselect all nodes
        const spans = document.querySelectorAll("#treeViewContainer ul li span");
        spans.forEach(span => span.classList.remove("selected"));

        // Select the clicked node, if possible
        if (e.treeViewNode && e.treeViewNode.domElement) {
            const selectedNodeSpan = e.treeViewNode.domElement.querySelector('span');
            if (selectedNodeSpan) {
                selectedNodeSpan.classList.add("selected");
            }
        }

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
}
