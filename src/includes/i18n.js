import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import mya from '@/locales/mya.json';

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    mya
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    mya: {
      currency: {
        style: 'currency',
        currency: 'MMK'
      }
    }
  }
});
