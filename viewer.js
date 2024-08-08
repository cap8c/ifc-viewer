import {Viewer, WebIFCLoaderPlugin} from "xeokit-sdk";
import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

viewer.camera.eye = [-2.56, 8.38, 8.27];
viewer.camera.look = [13.44, 3.31, -14.83];
viewer.camera.up = [0.10, 0.98, -0.14];

const IfcAPI = new WebIFC.IfcAPI();

IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

IfcAPI.Init().then(() => {
  const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    WebIFC,
    IfcAPI
  });

  const model = ifcLoader.load({
    id: "myModel",
    src: "RST_basic_sample_project.ifc",
    excludeTypes: ["IfcSpace"],
    edges: true
  });

  model.on("loaded", () => {
    const metaModel = viewer.metaScene.metaModels["myModel"];
    const metaObject = viewer.metaScene.metaObjects["1xS3BCk291UvhgP2dvNsgp"];

    const name = metaObject.name;
    const type = metaObject.type;
    const parent = metaObject.parent;
    const children = metaObject.children;
    const objectId = metaObject.id;
    const objectIds = viewer.metaScene.getObjectIDsInSubtree(objectId);
    const aabb = viewer.scene.getAABB(objectIds);

    viewer.scene.setObjectsXRayed(viewer.scene.objectIds, true);
    viewer.scene.setObjectsXRayed(objectIds, false);

    viewer.cameraFlight.flyTo(aabb);

    const model = viewer.scene.models["myModel"];
    model.destroy();
  });
});
