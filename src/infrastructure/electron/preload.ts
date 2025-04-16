import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => {
        // Log the IPC call for debugging
        console.log('IPC Invoke:', channel, args);
        return ipcRenderer.invoke(channel, ...args);
      },
      on: (channel: string, func: (...args: any[]) => void) => {
        // Wrap the function to preserve the correct scope
        const subscription = (_event: any, ...args: any[]) => func(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      },
      once: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      },
      removeListener: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.removeListener(channel, func);
      },
      // Add a debug method
      sendDebug: (message: string) => {
        ipcRenderer.send('debug', message);
      }
    },
  }
);

// Log when preload script is loaded
console.log('Preload script loaded');