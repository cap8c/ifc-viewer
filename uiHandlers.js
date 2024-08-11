export function setupUI(viewer) {
    const groupByTypesButton = document.getElementById("groupByTypesButton");
    const groupByLevelsButton = document.getElementById("groupByLevelsButton");

    groupByTypesButton.addEventListener("click", () => {
        const treeView = viewer.scene.plugins.TreeViewPlugin;
        treeView.groupTypes = true;
        treeView.groupLevels = false;
        treeView.refresh();  // Rebuild the tree with the new grouping
    });

    groupByLevelsButton.addEventListener("click", () => {
        const treeView = viewer.scene.plugins.TreeViewPlugin;
        treeView.groupTypes = false;
        treeView.groupLevels = true;
        treeView.refresh();  // Rebuild the tree with the new grouping
    });
}
