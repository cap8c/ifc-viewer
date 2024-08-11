import { ContextMenu } from "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

export function setupTreeView(viewer, treeView) {
    const treeViewContextMenu = new ContextMenu({
        items: [
            [
                [
                    {
                        title: "Hide",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                                if (treeViewNode.objectId) {
                                    const entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = false;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "Show",
                        doAction: function (context) {
                            context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                                if (treeViewNode.objectId) {
                                    const entity = context.viewer.scene.objects[treeViewNode.objectId];
                                    if (entity) {
                                        entity.visible = true;
                                    }
                                }
                            });
                        }
                    }
                ]
            ]
        ]
    });

    treeView.on("contextmenu", (e) => {
        treeViewContextMenu.show(e.event.pageX, e.event.pageY);
        treeViewContextMenu.context = {
            viewer: e.viewer,
            treeViewPlugin: e.treeViewPlugin,
            treeViewNode: e.treeViewNode
        };
    });

    // Highlighting Nodes on Title Click and keeping others in X-Ray mode
    treeView.on("nodeTitleClicked", (e) => {
        const scene = viewer.scene;
        const objectIds = [];
        e.treeViewPlugin.withNodeTree(e.treeViewNode, (treeViewNode) => {
            if (treeViewNode.objectId) {
                objectIds.push(treeViewNode.objectId);
            }
        });
        scene.setObjectsXRayed(scene.objectIds, true);
        scene.setObjectsVisible(scene.objectIds, true);
        scene.setObjectsXRayed(objectIds, false);  // Keep selected object not X-Rayed
        viewer.cameraFlight.flyTo({
            aabb: scene.getAABB(objectIds),
            duration: 0.5
        });
    });
}
