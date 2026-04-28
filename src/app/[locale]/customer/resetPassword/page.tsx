// "use client";

// import { Suspense } from "react";
// import ResetPasswordContent from "./ResetPasswordContent";

// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ResetPasswordContent />
//     </Suspense>
//   );
// }


"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import ResetPasswordContent from "./ResetPasswordContent";

function Loading() {
  const t = useTranslations("common");

  return (
    <div className="flex items-center justify-center h-screen">
      {t("loading")}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}