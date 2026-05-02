// import createMiddleware from "next-intl/middleware";

// export default createMiddleware({
//   locales: ["en", "ar"],
//   defaultLocale: "en"
// });

// export const config = {
//   matcher: ["/((?!api|_next|.*\\..*).*)"]
// };

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar'
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};