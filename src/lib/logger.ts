const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message: string, data?: Record<string, unknown>) => {
    if (isDev) console.error(`[CAPIVAREX ERROR] ${message}`, data ?? '');
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    if (isDev) console.warn(`[CAPIVAREX WARN] ${message}`, data ?? '');
  },
  info: (message: string, data?: Record<string, unknown>) => {
    if (isDev) console.info(`[CAPIVAREX INFO] ${message}`, data ?? '');
  },
};
