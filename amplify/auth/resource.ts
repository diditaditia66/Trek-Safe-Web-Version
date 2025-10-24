import { defineAuth, secret } from '@aws-amplify/backend'

export const auth = defineAuth({
  loginWith: {
    email: true,

    // Google SSO
    externalProviders: {
      // redirect & logout URLs ditempatkan di level externalProviders
      callbackUrls: [
        'http://localhost:5173/',
        'https://trek-safe.didit-aditia.my.id/',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://trek-safe.didit-aditia.my.id/',
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

  multifactor: { mode: 'OFF' },

  userAttributes: {
    email: { required: true, mutable: false },
    givenName: { required: false, mutable: true },
    familyName: { required: false, mutable: true },
  },

  accountRecovery: 'EMAIL_ONLY',
})
