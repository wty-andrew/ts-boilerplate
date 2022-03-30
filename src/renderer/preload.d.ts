declare global {
  interface Window {
    electron: {
      on: (channel: string, callback: (...args: any[]) => void) => void
      once: (channel: string, callback: (...args: any[]) => void) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
      send: (channel: string, ...args: any[]) => void
    }
  }
}

export {}
