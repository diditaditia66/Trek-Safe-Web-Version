import { Amplify } from 'aws-amplify'

export async function configureAmplify() {
  let outputs = {}
  try {
    // Ambil file di runtime; kalau 404, lanjut dengan {}
    const res = await fetch('/amplify_outputs.json', { cache: 'no-store' })
    if (res.ok) {
      outputs = await res.json()
    } else {
      console.warn('[Amplify] amplify_outputs.json not found yet (res:', res.status, '). Auth disabled until backend is deployed.')
    }
  } catch (e) {
    console.warn('[Amplify] Failed to load amplify_outputs.json. Auth disabled until backend is deployed.', e)
  }
  Amplify.configure(outputs)
}
