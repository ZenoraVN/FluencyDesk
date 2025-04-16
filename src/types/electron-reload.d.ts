declare module 'electron-reload' {
    function electronReload(
        paths: string | string[],
        options?: {
            electron?: string;
            hardResetMethod?: 'exit' | 'notification';
            forceHardReset?: boolean;
        }
    ): void;
    export = electronReload;
}