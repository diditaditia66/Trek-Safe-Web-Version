// src/amplifyClient.js
import { Amplify } from 'aws-amplify'

export async function configureAmplify() {
  try {
    const res = await fetch('/amplify_outputs.json', { cache: 'no-store', credentials: 'same-origin' })
    const outputs = res.ok ? await res.json() : {}
    if (!outputs?.auth?.user_pool_id) {
      console.warn('[Amplify] outputs.json tidak memuat blok auth; Auth mungkin nonaktif.')
    }
    Amplify.configure(outputs)
  } catch (e) {
    console.error('[Amplify] Gagal memuat amplify_outputs.json', e)
    Amplify.configure({})
  }
}
