// uiHandlers.js
export function setupUI(viewer) {
  document.getElementById("selectButton").addEventListener("click", () => {
    const canvas = viewer.scene.canvas.canvas;
    const tooltip = document.getElementById("tooltip");

    const handlePick = (e) => {
      const coords = [e.clientX, e.clientY];
      const hit = viewer.scene.pick({ canvasPos: coords });

      if (hit && hit.entity) {
        const objectId = hit.entity.id;
        console.log("Picked object ID:", objectId);
        viewer.scene.setObjectsHighlighted([objectId], true);
        viewer.scene.setObjectsHighlighted(viewer.scene.highlightedObjectIds.filter(id => id !== objectId), false);

        tooltip.innerText = `Object ID: ${objectId}`;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    };

    if (!viewer.selectionActive) {
      canvas.addEventListener("click", handlePick);
      viewer.selectionActive = true;
    } else {
      canvas.removeEventListener("click", handlePick);
      viewer.selectionActive = false;
      tooltip.style.display = 'none';
    }
  });

  document.getElementById("toggleTreeView").addEventListener("click", () => {
    const treeViewDiv = document.getElementById("treeview");
    treeViewDiv.style.display = treeViewDiv.style.display === "none" ? "block" : "none";
  });
}
