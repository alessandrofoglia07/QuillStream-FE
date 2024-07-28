/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_AWS_USER_POOL_ID: string;
    readonly VITE_AWS_POOL_CLIENT_ID: string;
    readonly VITE_WEBSOCKET_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}