export function setupUI(viewer, treeView) {
    const groupByTypesButton = document.getElementById("groupByTypesButton");
    const groupByLevelsButton = document.getElementById("groupByLevelsButton");

    groupByTypesButton.addEventListener("click", () => {
        treeView.groupTypes = true;
        treeView.groupLevels = false;
        treeView.refresh();  // Rebuild the tree with the new grouping
    });

    groupByLevelsButton.addEventListener("click", () => {
        treeView.groupTypes = false;
        treeView.groupLevels = true;
        treeView.refresh();  // Rebuild the tree with the new grouping
    });
}
