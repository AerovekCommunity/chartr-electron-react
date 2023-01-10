import { Channels, AppDataPath } from 'main/preload';

declare global {
  interface Window {
    electron: {
      fileAccess: {
        getPath(pathName: "home" | "appData" | "userData" | "documents"): (() => string)
        getAppPath(): (() => string)
        writeFile(args: any): (() => void)
        readFile(filePath: string): (() => Buffer)
      };
      browserAccess: {
        openLink(link: string): void;
      };
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
