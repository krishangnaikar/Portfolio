import { Suspense } from "react";
import { GalleryView } from "@/components/SearchParamPages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Photos" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GalleryView />
    </Suspense>
  );
}
