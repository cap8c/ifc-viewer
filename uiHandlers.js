import { DirLight } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js";

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

  // X-Ray Mode Toggle
  xRayButton.addEventListener("click", () => {
    const xRayEnabled = viewer.scene.models.some(model => model.opacity === 0.3); // Check if any model is in X-Ray mode
    viewer.scene.models.forEach(model => {
      model.opacity = xRayEnabled ? 1.0 : 0.3; // Toggle opacity
    });
  });

  // Sunlight Toggle
  let sunlight;
  sunButton.addEventListener("click", () => {
    if (!sunlight) {
      // If sunlight hasn't been initialized yet, create it
      sunlight = new DirLight(viewer.scene, {
        dir: [0.5, -1, 0.5],
        color: [1.0, 1.0, 1.0],
        intensity: 0.8
      });
    } else {
      // Toggle the sunlight on/off
      sunlight.setEnabled(!sunlight.enabled);
    }
  });
}
