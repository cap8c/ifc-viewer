export function setupUI(viewer) {
  const canvas = viewer.scene.canvas.canvas;
  const tooltip = document.getElementById("tooltip");

  if (!canvas || !tooltip) {
    console.error("Canvas or Tooltip element not found.");
    return;
  }

  document.getElementById("selectButton").addEventListener("click", () => {
    const handlePick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const coords = [
        e.clientX - rect.left,
        e.clientY - rect.top,
      ];
      const hit = viewer.scene.pick({
        canvasPos: coords
      });

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
      console.log("Selection tool is now active");
    } else {
      canvas.removeEventListener("click", handlePick);
      viewer.selectionActive = false;
      console.log("Selection tool is now inactive");
      tooltip.style.display = 'none';
    }
  });
}
