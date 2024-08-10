export function setupUI(viewer) {
  const searchBox = document.getElementById("searchBox");
  const selectButton = document.getElementById("selectButton");

  if (!searchBox || !selectButton) {
    console.error("SearchBox or SelectButton not found.");
    return;
  }

  const treeView = viewer.scene.plugins.treeView; // Reference to the TreeViewPlugin instance

  // Implementing search functionality
  searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();
    
    // Clear previous search results
    treeView.collapseAllNodes();

    if (query) {
      // Expand and highlight matching nodes
      treeView.getNodes().forEach(node => {
        const name = node.title.toLowerCase();
        if (name.includes(query)) {
          node.expand();
          viewer.scene.setObjectsHighlighted([node.entity.id], true);
        } else {
          viewer.scene.setObjectsHighlighted([node.entity.id], false);
        }
      });
    }
  });

  const toggleSelectionTool = () => {
    // Existing select button functionality...
  };

  selectButton.addEventListener("click", toggleSelectionTool);
}
