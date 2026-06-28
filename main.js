const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'PilotResto',
    icon: path.join(__dirname, 'assets/icon.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1B2A4A',
    show: false,
  })

  mainWindow.loadURL('https://restopilot.pro/login?source=electron')

  // Force User-Agent avec identifiant Electron pour le middleware Next.js
  const ua = mainWindow.webContents.getUserAgent()
  if (!ua.includes('Electron')) {
    mainWindow.webContents.setUserAgent(ua + ' PilotResto/1.0.0 Electron')
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://restopilot.pro')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const template = [
  {
    label: 'PilotResto',
    submenu: [
      { label: 'À propos de PilotResto', role: 'about' },
      { type: 'separator' },
      { label: 'Quitter', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
    ],
  },
  {
    label: 'Édition',
    submenu: [
      { label: 'Copier', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Coller', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Tout sélectionner', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
    ],
  },
  {
    label: 'Affichage',
    submenu: [
      { label: 'Recharger', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'Plein écran', accelerator: 'Ctrl+CmdOrCtrl+F', role: 'togglefullscreen' },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
