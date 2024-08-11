export function setupUI(viewer, treeView) {
    const searchBox = document.getElementById("searchBox");

    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();

        treeView.withNodeTree(treeView.rootNode, (node) => {
            const name = node.title.toLowerCase();
            if (name.includes(query)) {
                node.expand();
                viewer.scene.setObjectsHighlighted([node.objectId], true);
            } else {
                node.collapse();
                viewer.scene.setObjectsHighlighted([node.objectId], false);
            }
        });

        if (!query) {
            treeView.collapseAllNodes();
            viewer.scene.setObjectsHighlighted([], false);
        }
    });
}
