export const qk = {
  tickets: (f?: Record<string, unknown>) => ["tickets", f ?? {}] as const,
  ticket: (id: string) => ["ticket", id] as const
};
