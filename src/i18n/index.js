import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import tw from './zh-TW.json';
// import { Translation } from 'react-i18next'
import { useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const Translator = (content) => {
    const { t } = useTranslation();
    return t(content)
}

const resources = {
    en: {
      translation: en,
    },
    'zh-TW': {
      translation: tw,
    },
  };
  i18n.use(LanguageDetector)
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',             //預設語言
    fallbackLng: 'en',     //如果當前切換的語言沒有對應的翻譯則使用這個語言，
    interpolation: {
      escapeValue: false,
    },
  });


