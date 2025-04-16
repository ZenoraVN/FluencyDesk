import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import electronReload from 'electron-reload';
import { ElectronStoreUserRepository } from '../../infrastructure/repositories/ElectronStoreUserRepository';
import { UserManagementUseCase } from '../../core/usecases/UserManagementUseCase';
import { setupUserHandlers } from '../../infrastructure/electron/main/ipc/UserHandlers';

// Enable live reload in development
electronReload(__dirname, {
  electron: path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'electron')
});

class MainProcess {
  private mainWindow: BrowserWindow | null = null;
  private userManagementUseCase: UserManagementUseCase;

  constructor() {
    // Initialize repositories
    const userRepository = new ElectronStoreUserRepository();
    
    // Initialize use cases
    this.userManagementUseCase = new UserManagementUseCase(userRepository);
  }

  async initialize() {
    await app.whenReady();
    this.createWindow();
    this.setupIpcHandlers();
    this.setupAppHandlers();
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', '..', 'infrastructure', 'electron', 'preload.js'),
        webSecurity: false,
        sandbox: false
      }
    });

    // In development, we'll load from webpack dev server
    const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
    console.log('Loading HTML from:', indexPath);
    
    // Enable remote debugging in development
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
      console.log('Current directory:', __dirname);
      console.log('Attempted path:', indexPath);
    });

    this.mainWindow.webContents.on('did-fail-load', (_, code, desc) => {
      console.error('Failed to load:', code, desc);
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      console.log('Window loaded successfully');
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIpcHandlers() {
    if (!this.mainWindow) {
      throw new Error('Cannot setup IPC handlers before window is created');
    }
    setupUserHandlers(ipcMain, this.userManagementUseCase);

    // Debug IPC communication
    ipcMain.on('debug', (event, message) => {
      console.log('Debug message from renderer:', message);
    });
  }

  private setupAppHandlers() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createWindow();
      }
    });
  }
}

// Start the application
const mainProcess = new MainProcess();
mainProcess.initialize().catch(console.error);