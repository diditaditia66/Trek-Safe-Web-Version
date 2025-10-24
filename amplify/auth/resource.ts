import { defineAuth, secret } from '@aws-amplify/backend'

export const auth = defineAuth({
  // Jenis login utama
  loginWith: {
    email: true,

    // Login sosial (Google)
    externalProviders: {
      callbackUrls: [
        'http://localhost:5173/', // untuk dev lokal
      ],
      logoutUrls: [
        'http://localhost:5173/',
      ],
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid'],
        attributeMapping: {
          email: 'email',
          givenName: 'given_name',
          familyName: 'family_name',
        },
      },
    },
  },

  // MFA dinonaktifkan
  multifactor: {
    mode: 'OFF',
  },

  // Atribut user
  userAttributes: {
    email: { required: true, mutable: false },
    givenName: { required: false, mutable: true },
    familyName: { required: false, mutable: true },
  },
})
