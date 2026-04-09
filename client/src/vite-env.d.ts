/// <reference types="vite/client" />

declare const process: { env: { NODE_ENV: string } }

interface ImportMetaEnv {
  readonly VITE_TURN_URL: string
  readonly VITE_TURN_USERNAME: string
  readonly VITE_TURN_CREDENTIAL: string
  readonly VITE_SIGNAL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
