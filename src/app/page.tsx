import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const acceptLanguage = (await headers()).get("accept-language") || "";

  const isArabic = acceptLanguage.toLowerCase().includes("ar");

  redirect(isArabic ? "/ar" : "/en");
}