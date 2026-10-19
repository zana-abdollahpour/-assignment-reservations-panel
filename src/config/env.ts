// It's important to note that NODE_ENV (process.env.NODE_ENV) and Modes are two different concepts.
// check https://vite.dev/guide/env-and-mode for more info

export type NodeEnv = "development" | "production";
export type AppMode = "development" | "production" | "staging";

const NODEJS_ENV = process.env.NODE_ENV as NodeEnv;
const MODE = import.meta.env.MODE as AppMode;

export const NODE_ENV = {
  CURRENT: NODEJS_ENV,
  IS_DEVELOPMENT: NODEJS_ENV === "development",
  IS_PRODUCTION: NODEJS_ENV === "production",
} as const;

export const APP_MODE = {
  CURRENT: MODE,
  IS_DEVELOPMENT: MODE === "development",
  IS_STAGING: MODE === "staging",
  IS_PRODUCTION: MODE === "production",
} as const;
