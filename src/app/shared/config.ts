export interface Config {
  baseUrl?: string;
  defaults?: {
    search?: {
      from?: string;
      to?: string;
    };
  };
}

export const initConfig: Config = {};
