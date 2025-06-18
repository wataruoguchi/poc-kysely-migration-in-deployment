export function healthz(dbRevision: string) {
  return {
    dbRevision,
  };
}
