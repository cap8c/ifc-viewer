export function setupUI(viewer) {
    const searchBox = document.getElementById("searchBox");
    const selectButton = document.getElementById("selectButton");

    if (!searchBox || !selectButton) {
        console.error("SearchBox or SelectButton not found.");
        return;
    }

    const treeView = viewer.scene.treeView;

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

    const toggleSelectionTool = () => {
        // Existing select button functionality...
    };

    selectButton.addEventListener("click", toggleSelectionTool);
}
