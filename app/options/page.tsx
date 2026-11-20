import { Suspense } from "react";
import { OptionsView } from "@/components/SearchParamPages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Options" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OptionsView />
    </Suspense>
  );
}
