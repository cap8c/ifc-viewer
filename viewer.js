<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IFC Viewer</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: row;
        }
        #searchContainer {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 100;
            background-color: white;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border-radius: 5px;
        }
        #searchInput {
            width: 200px;
            padding: 5px;
        }
        #myTreeViewContainer {
            width: 300px;
            height: 100%;
            overflow-y: auto;
            background-color: #f3f3f3;
            border-right: 1px solid #ccc;
            padding: 10px;
        }
        #myCanvas {
            flex-grow: 1;
            background-color: #8cc7de;
        }
        .toolbar {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
            display: flex;
            gap: 10px;
        }
        .toolbar button {
            padding: 10px;
            background-color: #007bff;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
        }
        .toolbar button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div id="searchContainer">
        <input type="text" id="searchInput" placeholder="Search...">
    </div>
    <div id="myTreeViewContainer"></div>
    <canvas id="myCanvas"></canvas>
    <div class="toolbar">
        <button id="selectButton">Select</button>
    </div>

    <script type="module">
        import { Viewer, WebIFCLoaderPlugin, TreeViewPlugin } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/xeokit-sdk.es.min.js";
        import * as WebIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/web-ifc-api.js";

        console.log("Initializing Viewer");
        const viewer = new Viewer({
            canvasId: "myCanvas",
            transparent: true
        });

        viewer.camera.eye = [-2.56, 8.38, 8.27];
        viewer.camera.look = [13.44, 3.31, -14.83];
        viewer.camera.up = [0.10, 0.98, -0.14];

        const treeView = new TreeViewPlugin(viewer, {
            containerElement: document.getElementById("myTreeViewContainer")
        });

        console.log("Initializing IfcAPI");
        const IfcAPI = new WebIFC.IfcAPI();

        IfcAPI.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.51/");

        IfcAPI.Init().then(() => {
            console.log("IfcAPI initialized");
            const ifcLoader = new WebIFCLoaderPlugin(viewer, {
                WebIFC,
                IfcAPI
            });

            console.log("Loading IFC model");
            const model = ifcLoader.load({
                id: "myModel",
                src: "RST_basic_sample_project.ifc",
                excludeTypes: ["IfcSpace"],
                edges: true
            });

            model.on("loaded", () => {
                console.log("IFC model loaded successfully");
                treeView.expandToLevel(2);

                document.getElementById("searchInput").addEventListener("input", handleSearch);
            });

            model.on("error", (error) => {
                console.error("Error loading IFC model:", error);
            });
        }).catch((error) => {
            console.error("Error initializing IfcAPI:", error);
        });

        document.getElementById("selectButton").addEventListener("click", () => {
            if (viewer.scene.pick) {
                const pick = viewer.scene.pick({
                    canvasPos: viewer.scene.input.canvasPos
                });

                if (pick) {
                    console.log("Picked object ID:", pick.entity.id);
                    viewer.scene.setObjectsSelected([pick.entity.id], true);
                }
            }
        });

        function handleSearch(event) {
            const query = event.target.value.toLowerCase();
            if (!query) {
                viewer.scene.setObjectsHighlighted(viewer.scene.highlightedObjectIds, false);
                treeView.clearFilter();
                return;
            }

            const matches = [];
            const model = viewer.metaScene.metaModels["myModel"];

            for (const objectId in model.metaObjects) {
                const metaObject = model.metaObjects[objectId];
                if (metaObject.name.toLowerCase().includes(query)) {
                    matches.push(objectId);
                }
            }

            if (matches.length > 0) {
                viewer.scene.setObjectsHighlighted(matches, true);
                treeView.filter((node) => matches.includes(node.id));
            } else {
                viewer.scene.setObjectsHighlighted(viewer.scene.highlightedObjectIds, false);
                treeView.clearFilter();
            }

            console.log(`Found ${matches.length} objects matching '${query}'`);
        }
    </script>
</body>
</html>
