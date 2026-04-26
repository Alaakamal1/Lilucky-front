import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/en"); // أو detect من cookie / headers
}