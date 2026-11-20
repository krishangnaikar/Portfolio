import { Suspense } from "react";
import { ActivitiesView } from "@/components/SearchParamPages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Extracurriculars" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ActivitiesView />
    </Suspense>
  );
}
