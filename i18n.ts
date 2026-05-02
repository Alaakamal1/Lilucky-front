import {getRequestConfig} from 'next-intl/server';

const locales = ['ar', 'en'];

export default getRequestConfig(async ({locale}) => {
  const safeLocale = locale ?? 'ar';

  return {
    locale: safeLocale,
    messages: (await import(`./src/messages/${safeLocale}.json`)).default
  };
});