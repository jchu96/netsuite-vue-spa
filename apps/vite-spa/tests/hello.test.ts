// @vitest-environment jsdom
import { expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { mount, flushPromises } from '@vue/test-utils'
import HelloWorld from '../src/components/HelloWorld.vue'
import { apiKey } from '../plugins/netsuite-api'
import { useHelloStore } from '../src/stores/helloStore'
it('Vue page uses installed Pinia and PrimeVue for a read-only hello round trip', async () => {
  const helloRecord = vi.fn(async () => ({ id: '1', name: 'Hello world' }))
  const wrapper = mount(HelloWorld, { global: { plugins: [createPinia(), [PrimeVue, { unstyled: true }]], provide: { [apiKey as symbol]: { helloRecord } } } })
  await wrapper.get('form').trigger('submit')
  await flushPromises()
  expect(helloRecord).toHaveBeenCalledWith('Hello world', expect.any(AbortSignal))
  expect(wrapper.get('[role="status"]').text()).toContain('Record #1')
  expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
  wrapper.unmount()
})
it('store ignores stale responses and clears loading after cancellation', async () => {
  setActivePinia(createPinia())
  const store = useHelloStore()
  let finish!: (value: { id: string; name: string }) => void
  const slow = { helloRecord: vi.fn(() => new Promise<{ id: string; name: string }>(resolve => { finish = resolve })) }
  const pending = store.load(slow, 'old')
  await store.load({ helloRecord: async () => ({ id: '2', name: 'new' }) }, 'new')
  finish({ id: '1', name: 'old' }); await pending
  expect(store.record?.name).toBe('new')
  expect(store.loading).toBe(false)
  store.cancel()
  expect(store.loading).toBe(false)
})
it('store handles failure and no-result states', async () => {
  setActivePinia(createPinia())
  const store = useHelloStore()
  await store.load({ helloRecord: async () => { throw Error('Unavailable') } }, 'hello')
  expect(store.error).toBe('Unavailable'); expect(store.loading).toBe(false)
  await store.load({ helloRecord: async () => null }, 'missing')
  expect(store.error).toBe(''); expect(store.loaded).toBe(true); expect(store.record).toBeNull()
})
