module.exports = {
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    localeDetection: false,
  },
  localePath: './public/locales',
  fallbackLng: {
    'en': ['it'],
    'it': ['en'],
    default: ['it']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
}; 