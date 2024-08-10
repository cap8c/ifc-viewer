export function setupUI(viewer) {
  const searchBox = document.getElementById("searchBox");
  const selectButton = document.getElementById("selectButton");
  const xRayButton = document.getElementById("xRayButton");
  const sunButton = document.getElementById("sunButton");

  if (!searchBox || !selectButton || !xRayButton || !sunButton) {
    console.error("One or more UI elements not found.");
    return;
  }

  // Direct access to the treeView instance from viewer's plugins
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

  xRayButton.addEventListener("click", () => {
    const xRayEnabled = viewer.scene.objects[0].opacity === 0.3; // Assume all objects have the same opacity
    viewer.scene.setObjectsOpacity([], xRayEnabled ? 1.0 : 0.3);
  });

  sunButton.addEventListener("click", () => {
    const sunlight = viewer.scene.lights.getDirectionalLights()[0];
    sunlight.setEnabled(!sunlight.enabled);
  });
}
