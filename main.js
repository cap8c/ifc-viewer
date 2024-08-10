// main.js
import { setupViewer } from "./viewerSetup.js";
import { setupUI } from "./uiHandlers.js";

const viewer = setupViewer("myCanvas");
setupUI(viewer);
