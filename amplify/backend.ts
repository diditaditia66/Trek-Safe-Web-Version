// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'

// Jika nanti kamu menambah resource lain seperti database, storage, dsb.,
// cukup impor di sini dan masukkan ke dalam objek defineBackend.
// Contoh:
// import { data } from './data/resource'
// const backend = defineBackend({ auth, data })

const backend = defineBackend({
  auth,
})

export default backend
