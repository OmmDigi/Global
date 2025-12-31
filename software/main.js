const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require("electron");
const path = require("path");

require("./bridge.js");

let mainWindow;
let browserView;

app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
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

  // Function to update BrowserView bounds
  function updateBrowserViewBounds() {
    const bounds = mainWindow.getContentBounds(); // Use getContentBounds instead of getBounds
    if (browserView) {
      browserView.setBounds({
        x: 0,
        y: 35, // Leave space for progress bar
        width: bounds.width,
        height: bounds.height - 35, // Subtract the header height
      });
    }
  }

  // Initial bounds setting
  updateBrowserViewBounds();

  // Auto-resize BrowserView when window is resized
  mainWindow.on("resize", updateBrowserViewBounds);
  mainWindow.on("maximize", updateBrowserViewBounds);
  mainWindow.on("unmaximize", updateBrowserViewBounds);

  // Load the target URL in BrowserView
  // browserView.webContents.loadURL("https://frontend.globaltechnicalinstitute.com/login");
  browserView.webContents.loadURL("https://crm.globaltechnicalinstitute.com/signin");

  // Remove or increase the zoom factor - this might be cutting off content
  // browserView.webContents.setZoomFactor(0.9); // Try removing this line or setting to 1.0
  browserView.webContents.setZoomFactor(0.9);

  // Wait for the page to load before setting zoom
  browserView.webContents.once('did-finish-load', () => {
    // Optional: Set zoom after page loads
    // browserView.webContents.setZoomFactor(1.0);
  });

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
    
    // Update bounds after page loads to ensure proper display
    setTimeout(updateBrowserViewBounds, 100);
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
    // Ensure bounds are set correctly when window is shown
    setTimeout(updateBrowserViewBounds, 100);
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

// Add IPC handler to adjust zoom
ipcMain.on("set-zoom", (event, zoomFactor) => {
  if (browserView) {
    browserView.webContents.setZoomFactor(zoomFactor);
  }
});

// Add IPC handler to get current zoom
ipcMain.handle("get-zoom", () => {
  return browserView ? browserView.webContents.getZoomFactor() : 1.0;
});