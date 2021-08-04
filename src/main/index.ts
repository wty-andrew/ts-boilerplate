import path from 'path'
import { app, BrowserWindow } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow

const startUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../renderer/index.html')}`

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
