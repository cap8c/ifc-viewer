export function setupUI(viewer, treeView) {
    const searchBox = document.getElementById("searchBox");

    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();

        treeView.getNodes().forEach(node => {
            const name = node.title.toLowerCase();
            if (name.includes(query)) {
                node.expand();
                viewer.scene.setObjectsHighlighted([node.entity.id], true);
            } else {
                node.collapse();
                viewer.scene.setObjectsHighlighted([node.entity.id], false);
            }
        });

        // If the search box is cleared, collapse all nodes and remove highlights
        if (!query) {
            treeView.collapseAllNodes();
            viewer.scene.setObjectsHighlighted([], false);
        }
    });
}
