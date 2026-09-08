<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { apiKey } from '../../plugins/netsuite-api'
import { useHelloStore } from '../stores/helloStore'
const api = inject(apiKey)
if (!api) throw new Error('API client is not installed')
const store = useHelloStore()
const name = ref('Hello world')
function lookup() { if (api) void store.load(api, name.value) }
onUnmounted(() => store.cancel())
</script>
<template>
  <section class="hello-card">
    <p class="eyebrow">NETSUITE VUE SPA</p>
    <h1>Hello Record</h1>
    <p>A small, read-only starting point for your next NetSuite application.</p>
    <form @submit.prevent="lookup">
      <label for="record-name">Record name</label>
      <InputText id="record-name" v-model="name" required maxlength="80" />
      <Button type="submit" label="Find hello record" :loading="store.loading" :disabled="store.loading || !name.trim()" />
    </form>
    <p v-if="store.loading" role="status">Looking up the record…</p>
    <p v-else-if="store.error" role="alert">{{ store.error }}</p>
    <div v-else-if="store.record" role="status"><h2>{{ store.record.name }}</h2><p>Record #{{ store.record.id }}</p></div>
    <p v-else-if="store.loaded" role="status">No matching hello record. Create one in the Hello Record list, then try again.</p>
    <p class="hint">Local demo returns a synthetic record. In NetSuite, this page reads the Hello Record custom list.</p>
  </section>
</template>
