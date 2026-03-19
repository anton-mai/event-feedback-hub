export const getEnvString = (value: unknown, defaultValue: string): string =>
  typeof value === 'string' ? value : defaultValue;
