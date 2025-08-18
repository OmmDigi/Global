const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require("electron");
const path = require("path");

require("./bridge.js");

let mainWindow;
let browserView;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Disable for local network access
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    titleBarStyle: "default",
    icon: path.join(__dirname, "assets", "icon.png"),
  });

  // Load the wrapper HTML file (now just for progress bar UI)
  mainWindow.loadFile("index.html");

  // Create BrowserView for the web content
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      experimentalFeatures: true, // Enable experimental web features
      enableBlinkFeatures: "CSSColorSchemeUARendering", // Enable modern CSS features
    },
  });

  // Set BrowserView
  mainWindow.setBrowserView(browserView);

  Menu.setApplicationMenu(null);

  // Position the BrowserView (leave space for progress bar at top)
  const bounds = mainWindow.getBounds();
  browserView.setBounds({
    x: 0,
    y: 35, // Leave space for progress bar and any UI
    width: bounds.width,
    height: bounds.height - 35,
  });

  // Auto-resize BrowserView when window is resized
  mainWindow.on("resize", () => {
    const bounds = mainWindow.getBounds();
    if (browserView) {
      browserView.setBounds({
        x: 0,
        y: 35,
        width: bounds.width,
        height: bounds.height - 35,
      });
    }
  });

  // Load the target URL in BrowserView
  browserView.webContents.loadURL("http://192.168.0.214:3000/login");

  // BrowserView event handlers
  browserView.webContents.on("did-start-loading", () => {
    // console.log('BrowserView started loading');
    mainWindow.webContents.send("loading-started");
  });

  browserView.webContents.on("did-stop-loading", () => {
    // console.log('BrowserView stopped loading');
    mainWindow.webContents.send("loading-stopped");
  });

  browserView.webContents.on("did-finish-load", () => {
    // console.log('BrowserView finished loading');
    mainWindow.webContents.send("loading-finished");
  });

  browserView.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      // console.error("BrowserView failed to load:", {
      //   errorCode,
      //   errorDescription,
      //   validatedURL,
      // });
      mainWindow.webContents.send("loading-failed", {
        errorCode,
        errorDescription,
        validatedURL,
      });
    }
  );

  browserView.webContents.on("did-navigate", (event, url) => {
    // console.log('BrowserView navigated to:', url);
    mainWindow.webContents.send("loading-started");
  });

  browserView.webContents.on("did-navigate-in-page", (event, url) => {
    // console.log('BrowserView in-page navigation:', url);
    mainWindow.webContents.send("loading-started");
  });

  // Handle new window requests
  browserView.webContents.setWindowOpenHandler(({ url }) => {
    // Load in the same BrowserView instead of opening new window
    browserView.webContents.loadURL(url);
    return { action: "deny" };
  });

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
    browserView = null;
  });

  // Open DevTools in development
  if (process.argv.includes("--debug")) {
    mainWindow.webContents.openDevTools();
    browserView.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC messages
ipcMain.on("reload-page", () => {
  if (browserView) {
    browserView.webContents.reload();
  }
});

ipcMain.on("navigate-to", (event, url) => {
  if (browserView) {
    browserView.webContents.loadURL(url);
  }
});

ipcMain.on("go-back", () => {
  if (browserView && browserView.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});

ipcMain.on("go-forward", () => {
  if (browserView && browserView.webContents.canGoForward()) {
    browserView.webContents.goForward();
  }
});

ipcMain.handle("can-go-back", () => {
  return browserView ? browserView.webContents.canGoBack() : false;
});

ipcMain.handle("can-go-forward", () => {
  return browserView ? browserView.webContents.canGoForward() : false;
});
