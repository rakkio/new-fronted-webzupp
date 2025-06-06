import { useTranslation as useNextTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const useTranslation = (namespace = 'common') => {
  const { t, i18n } = useNextTranslation(namespace);
  const router = useRouter();

  const changeLanguage = (lang) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  const currentLanguage = i18n?.language || router.locale || 'it';

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    isItalian: currentLanguage === 'it',
    isEnglish: currentLanguage === 'en',
  };
}; 