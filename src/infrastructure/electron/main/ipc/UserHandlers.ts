import { IpcMain } from 'electron';
import { UserManagementUseCase } from '../../../../core/usecases/UserManagementUseCase';

export function setupUserHandlers(ipcMain: IpcMain, userManagementUseCase: UserManagementUseCase) {
  ipcMain.handle('user:create', async (_, { email, username }) => {
    try {
      const user = await userManagementUseCase.createUser(email, username);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('user:get', async (_, { id }) => {
    try {
      const user = await userManagementUseCase.getUser(id);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('user:list', async () => {
    try {
      const users = await userManagementUseCase.listUsers();
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('user:delete', async (_, { id }) => {
    try {
      await userManagementUseCase.deleteUser(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}