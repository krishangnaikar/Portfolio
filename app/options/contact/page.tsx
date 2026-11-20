import { Suspense } from "react";
import { ContactView } from "@/components/SearchParamPages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Me" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContactView />
    </Suspense>
  );
}
