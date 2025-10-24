import { Amplify } from 'aws-amplify'

export async function configureAmplify() {
  let outputs = {}
  try {
    outputs = (await import('../amplify_outputs.json')).default
  } catch (e) {
    console.warn('[Amplify] amplify_outputs.json not found yet. Auth is disabled until backend is deployed.')
  }
  Amplify.configure(outputs)
}
