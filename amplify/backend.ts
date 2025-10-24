import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'

// Jika nanti ingin menambah data, storage, dsb.
// import { data } from './data/resource'

const backend = defineBackend({
  auth,
})

export default backend
