// electron/ipc/handlers/nara.handler.ts

import { ipcMain } from 'electron';
import { createNaraClient } from '../../../backend/services/nara-client.factory';

const naraClient = createNaraClient();

export function registerNaraHandlers() {
  ipcMain.handle('nara:search', async (_, queryString: string) => {
    return await naraClient.searchAndMapToEad3(queryString);
  });

  ipcMain.handle('nara:getFull', async (_, naId: number) => {
    return await naraClient.getFullAndMapToEad3(naId);
  });

  ipcMain.handle('nara:getChildren', async (_, parentId: number, limit?: number) => {
    return await naraClient.getChildrenAndMapToEad3(parentId, limit || 50);
  });
}