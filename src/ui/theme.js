// src/ui/theme.js
import { defaultTheme, createTheme } from '@aws-amplify/ui-react'

export const trekTheme = createTheme({
  name: 'trek-theme',
  overrides: [defaultTheme],
  tokens: {
    colors: {
      brand: {
        primary: { 10: '#EEF7FF', 40: '#79B9FF', 60: '#2D8CFF', 80: '#1667CC', 90: '#0E4B99' },
      },
      font: { primary: { value: '#111418' } },
      background: { primary: { value: '#ffffff' } },
    },
    radii: { small: { value: '10px' }, medium: { value: '14px' }, large: { value: '20px' } },
    components: {
      button: { borderRadius: { value: '{radii.medium.value}' } },
      card:   { borderRadius: { value: '{radii.large.value}' } },
    },
    fonts: {
      default: { variable: { value: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' } },
    },
    space: {
      xs: { value: '6px' }, sm: { value: '10px' }, md: { value: '16px' },
      lg: { value: '24px' }, xl: { value: '32px' }, '2xl': { value: '48px' }
    }
  }
})
