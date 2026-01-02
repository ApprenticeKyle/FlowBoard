import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import enTranslation from '../locales/en.json';
import zhTranslation from '../locales/zh.json';

// 初始化i18n
i18n
  .use(initReactI18next) // 传递给react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // React已经处理了XSS，所以不需要额外的转义
    }
  });

export default i18n;