import type { InjectionKey } from 'vue'
export interface HelloRecord { id: string; name: string }
export interface ApiClient { helloRecord(name: string, signal?: AbortSignal): Promise<HelloRecord | null> }
export const apiKey: InjectionKey<ApiClient> = Symbol('netsuiteApi')
export function createApiClient({ development, endpoint, port = '3333', fetcher = fetch }:
  { development: boolean; endpoint: string; port?: string; fetcher?: typeof fetch }): ApiClient {
  let token: string | undefined
  const proxy = 'http://127.0.0.1:' + port
  return {
    async helloRecord(name, signal) {
      if (development && !token) {
        const session = await fetcher(proxy + '/session', { method: 'POST', signal })
        if (!session.ok) throw new Error('Cannot open local proxy session')
        const body: unknown = await session.json()
        if (!body || typeof body !== 'object' || !('token' in body) || typeof body.token !== 'string') throw new Error('Invalid proxy session')
        token = body.token
      }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (development && token) headers['X-Proxy-Token'] = token
      const response = await fetcher(development ? proxy + '/api' : endpoint, {
        method: 'POST', headers, body: JSON.stringify({ task: 'helloRecord', name }), signal,
        credentials: development ? 'omit' : 'same-origin',
      })
      if (!response.ok) {
        if (response.status === 403) token = undefined
        throw new Error('Request failed (' + response.status + ')')
      }
      const body: unknown = await response.json()
      if (!body || typeof body !== 'object' || !('success' in body) || body.success !== true || !('data' in body)) throw new Error('Unable to read hello record')
      if (body.data === null) return null
      const data = body.data
      if (!data || typeof data !== 'object' || !('id' in data) || typeof data.id !== 'string' || !('name' in data) || typeof data.name !== 'string') throw new Error('Invalid hello record response')
      return { id: data.id, name: data.name }
    },
  }
}
