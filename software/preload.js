const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  reloadPage: () => {
    ipcRenderer.send("reload-page");
  },
  navigateTo: (url) => {
    ipcRenderer.send("navigate-to", url);
  },

  // Navigation actions (ADD THESE)
  goBack: () => ipcRenderer.send("go-back"),
  goForward: () => ipcRenderer.send("go-forward"),

  // Navigation state queries
  canGoBack: () => ipcRenderer.invoke("can-go-back"),
  canGoForward: () => ipcRenderer.invoke("can-go-forward"),
  getCurrentUrl: () => ipcRenderer.invoke("get-current-url"),

  onLoadingStarted: (callback) => {
    ipcRenderer.on("loading-started", callback);
  },
  onLoadingStopped: (callback) => {
    ipcRenderer.on("loading-stopped", callback);
  },
  onLoadingFinished: (callback) => {
    ipcRenderer.on("loading-finished", callback);
  },
  onLoadingFailed: (callback) => {
    ipcRenderer.on("loading-failed", callback);
  },
});
