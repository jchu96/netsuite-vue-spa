import { expect, it, vi } from 'vitest'
import { createApiClient } from '../plugins/netsuite-api'
it('production uses the same-account endpoint, checks the envelope and never creates a proxy session', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: '1', name: 'Hello' } })))
  const api = createApiClient({ development: false, endpoint: '/app/site/hosting/restlet.nl?script=test', fetcher })
  expect(await api.helloRecord('Hello')).toEqual({ id: '1', name: 'Hello' })
  expect(fetcher).toHaveBeenCalledTimes(1)
  expect(fetcher.mock.calls[0]).toEqual(['/app/site/hosting/restlet.nl?script=test', expect.objectContaining({ credentials: 'same-origin', body: '{"task":"helloRecord","name":"Hello"}' })])
  expect(fetcher.mock.calls[0][1]?.headers).not.toHaveProperty('Authorization')
})
it('development obtains and attaches an ephemeral proxy session token', async () => {
  const fetcher = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(new Response('{"token":"synthetic-session"}'))
    .mockResolvedValueOnce(new Response('{"success":true,"data":null}'))
  const api = createApiClient({ development: true, endpoint: '/unused', fetcher })
  expect(await api.helloRecord('Missing')).toBeNull()
  expect(fetcher.mock.calls[0][0]).toBe('http://127.0.0.1:3333/session')
  expect(fetcher.mock.calls[1][1]?.headers).toHaveProperty('X-Proxy-Token', 'synthetic-session')
})
it.each([
  new Response('{}', { status: 500 }),
  new Response('{"success":false,"error":{"message":"private details"}}'),
  new Response('{"success":true,"data":{"id":1,"name":"Hello"}}'),
])('rejects HTTP and malformed responses', async response => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response)
  const api = createApiClient({ development: false, endpoint: '/restlet', fetcher })
  await expect(api.helloRecord('Hello')).rejects.toThrow()
})
