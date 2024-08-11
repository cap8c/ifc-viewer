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
}
