import path from 'path'
import { app, BrowserWindow } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow

const startUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../renderer/index.html')}`

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  await mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', async () => {
  if (isDev) {
    const { default: installExtensions, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    )
    await installExtensions([REACT_DEVELOPER_TOOLS])
  }

  await createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
