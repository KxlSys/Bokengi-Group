export interface RequestDrizzleScope {
  pool: {
    end: () => Promise<any>
    [key: string]: any
  }
  drizzle: any
  ended: boolean
}

// Non-intrusive request-scoped DB mapping
export const requestDrizzleMap = new WeakMap<object, RequestDrizzleScope>()

/**
 * Wraps a Response to trigger database pool cleanup when the response body stream finishes.
 * Handles normal EOF, cancel (client abort/navigation), stream errors, and bodiless responses.
 */
export function wrapResponseWithDbCleanup(
  response: Response,
  ctx: any,
  scope: RequestDrizzleScope | undefined
): Response {
  if (!scope || scope.ended) {
    return response
  }

  const triggerCleanup = () => {
    if (!scope.ended) {
      scope.ended = true
      const closePromise = scope.pool.end().catch((err: unknown) => {
        console.error('[DB-CLEANUP-ERROR]:', err)
      })
      if (typeof ctx?.waitUntil === 'function') {
        ctx.waitUntil(closePromise)
      }
    }
  }

  // 1. Responses without body (Redirects 301/302/307/308, 204 No Content, 304, HEAD, etc.)
  if (!response.body) {
    triggerCleanup()
    return response
  }

  // 2. Streamed responses (RSC, HTML streaming, JSON payload)
  const reader = response.body.getReader()

  const wrappedStream = new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          triggerCleanup()
        } else {
          controller.enqueue(value)
        }
      } catch (streamError) {
        controller.error(streamError)
        triggerCleanup()
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason)
      } finally {
        triggerCleanup()
      }
    },
  })

  return new Response(wrappedStream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}
