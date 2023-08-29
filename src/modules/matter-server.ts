import {
  CommissioningServer,
  MatterServer as MatterNodeServer,
} from '@project-chip/matter-node.js';
import { Level, Logger } from '@project-chip/matter-node.js/log';
import {
  StorageBackendDisk,
  StorageManager,
} from '@project-chip/matter-node.js/storage';
// @ts-ignore
import pickPort from 'pick-port';

const LOG_LEVEL = Number(process.env.NODE_RED_MATTER_LOG_LEVEL);
switch (LOG_LEVEL) {
  case 0:
    Logger.defaultLogLevel = Level.DEBUG;
    break;
  case 1:
    Logger.defaultLogLevel = Level.INFO;
    break;
  case 2:
    Logger.defaultLogLevel = Level.WARN;
    break;
  case 3:
    Logger.defaultLogLevel = Level.ERROR;
    break;
  case 4:
    Logger.defaultLogLevel = Level.FATAL;
    break;
  default:
    Logger.defaultLogLevel = Level.ERROR;
}

export class MatterServer {
  private matterServer: MatterNodeServer | undefined;

  async init({ storageLocation }: { storageLocation: string }) {
    const storage = new StorageBackendDisk(storageLocation);
    const storageManager = new StorageManager(storage);
    await storageManager.initialize();

    this.matterServer = new MatterNodeServer(storageManager);
  }

  addCommissioningServer(commissioningServer: CommissioningServer) {
    this.matterServer?.addCommissioningServer(commissioningServer);
  }

  async start() {
    await this.matterServer?.start();
  }

  async stop() {
    await this.matterServer?.close();
  }
}
