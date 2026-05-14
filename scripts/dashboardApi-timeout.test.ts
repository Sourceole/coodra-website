import { strict as assert } from 'node:assert'
import { getJson } from '../src/dashboard/dashboardApi'

const originalFetch = globalThis.fetch
const originalWindow = globalThis.window

Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { __COODRA_API_BASE__: 'https://api.example.test' }
})

globalThis.fetch = ((_url: RequestInfo | URL, init?: RequestInit) => {
  return new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    })
  })
}) as typeof fetch

const startedAt = Date.now()
const result = await getJson('/api/stuck', 'test-jwt', 25)
const elapsed = Date.now() - startedAt

assert.equal(result.ok, false)
assert.equal(result.error, 'request_timeout')
assert.ok(elapsed < 250, `expected timeout quickly, took ${elapsed}ms`)

globalThis.fetch = originalFetch
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: originalWindow
})

console.log('dashboardApi timeout behavior ok')
