/**
 * Shim for undici in Cloudflare Worker runtime (workerd).
 * Undici contains native Node.js socket, HTTP parser, and worker_threads (MessagePort)
 * dependencies that cannot run in Cloudflare Workers.
 * In Cloudflare Workers, native web standard fetch APIs are provided by the runtime.
 */
export class Agent {
  constructor(_options?: unknown) {}
  close(): Promise<void> | void {}
  destroy(): Promise<void> | void {}
}

export const fetch = globalThis.fetch
export const Request = globalThis.Request
export const Response = globalThis.Response
export const Headers = globalThis.Headers
export const FormData = globalThis.FormData

export default {
  Agent,
  fetch,
  Request,
  Response,
  Headers,
  FormData,
}
