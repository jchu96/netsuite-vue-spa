import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ApiClient, HelloRecord } from '../../plugins/netsuite-api'
export const useHelloStore = defineStore('hello', () => {
  const record = ref<HelloRecord | null>(null)
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)
  let current: AbortController | undefined
  async function load(api: ApiClient, name: string) {
    current?.abort()
    const controller = new AbortController()
    current = controller
    loading.value = true
    error.value = ''
    loaded.value = false
    record.value = null
    try {
      const result = await api.helloRecord(name, controller.signal)
      if (current !== controller) return
      record.value = result
      loaded.value = true
    } catch (failure: unknown) {
      if (current === controller && !controller.signal.aborted) error.value = failure instanceof Error ? failure.message : 'Request failed'
    } finally {
      if (current === controller) loading.value = false
    }
  }
  function cancel() { current?.abort(); current = undefined; loading.value = false }
  return { record, loading, error, loaded, load, cancel }
})
