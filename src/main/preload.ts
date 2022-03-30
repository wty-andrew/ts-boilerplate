import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  on: (channel: string, callback: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  once: (channel: string, callback: (...args: any[]) => void) =>
    ipcRenderer.once(channel, (event, ...args) => callback(...args)),
  invoke: async (channel: string, ...args: any[]) =>
    await ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
})
