// src/types/netsuite-api.d.ts
import type { InjectionKey } from 'vue'

export type NetsuitePost = (payload: any) => Promise<Response>

// We'll use this key in code if we want typed injects:
export const NetsuiteApiKey: InjectionKey<NetsuitePost>

declare module '../plugins/netsuite-api' {
    import type { Plugin } from 'vue'
    const plugin: Plugin
    export default plugin
}
