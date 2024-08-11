export function setupUI(viewer, treeView) {
    const searchBox = document.getElementById("searchBox");

    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();

        if (query) {
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
        } else {
            treeView.collapseAllNodes();
            viewer.scene.setObjectsHighlighted([], false);
        }
    });
}
