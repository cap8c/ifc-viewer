export function setupUI(viewer) {
  const canvas = viewer.scene.canvas.canvas;
  const tooltip = document.getElementById("tooltip");
  const selectButton = document.getElementById("selectButton");

  if (!canvas || !tooltip || !selectButton) {
    console.error("Canvas, Tooltip, or SelectButton element not found.");
    return;
  }

  const handleHover = (e) => {
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
      const object = viewer.metaScene.metaObjects[objectId];

      if (object) {
        let properties = '';
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            properties += `${key}: ${object[key]}<br>`;
          }
        }

        tooltip.innerHTML = properties;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.display = 'block';
      }
    } else {
      tooltip.style.display = 'none';
    }
  };

  canvas.addEventListener("mousemove", handleHover);

  const toggleSelectionTool = () => {
    if (!viewer.selectionActive) {
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

      canvas.addEventListener("click", handlePick);
      viewer.selectionActive = true;
      selectButton.innerText = "Disable Select";
      console.log("Selection tool is now active");
    } else {
      canvas.removeEventListener("click", handlePick);
      viewer.selectionActive = false;
      selectButton.innerText = "Enable Select";
      tooltip.style.display = 'none';
      console.log("Selection tool is now inactive");
    }
  };

  selectButton.addEventListener("click", toggleSelectionTool);
}
