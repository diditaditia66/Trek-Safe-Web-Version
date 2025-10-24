import { Amplify } from 'aws-amplify'

export async function configureAmplify() {
  try {
    const res = await fetch('/amplify_outputs.json', { cache: 'no-store' })
    const outputs = res.ok ? await res.json() : {}
    Amplify.configure(outputs)
  } catch {
    Amplify.configure({})
  }
}
