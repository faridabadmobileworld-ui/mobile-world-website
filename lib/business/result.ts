export class BusinessInputError extends Error {}
export type BusinessResult<T> = { ok: true; data: T } | { ok: false; error: string };
export function businessResult<T>(result: BusinessResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
