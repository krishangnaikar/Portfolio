"use client";

import ActivitiesClient from "@/components/ActivitiesClient";
import ContactScreen from "@/components/options/ContactScreen";
import GalleryScreen from "@/components/options/GalleryScreen";
import OptionsMenuClient from "@/components/options/OptionsMenuClient";
import { isActivityTab } from "@/lib/activityTabs";
import { parseMenuOrigin } from "@/lib/menuNavigation";
import { getPortfolio } from "@/lib/portfolio";
import { useSearchParams } from "next/navigation";

// These screens read the query string in the browser so the whole site can be a static export
// (needed for Cloudflare Pages). Each must be rendered inside a <Suspense> boundary.

export function ActivitiesView() {
  const params = useSearchParams();
  const tab = params.get("tab");
  const initialTab = isActivityTab(tab) ? tab : undefined;
  // Keyed so a client-side navigation to a different ?tab= remounts with that tab.
  return <ActivitiesClient key={initialTab ?? "default"} activities={getPortfolio().activities} initialTab={initialTab} />;
}

export function ContactView() {
  const params = useSearchParams();
  return <ContactScreen data={getPortfolio()} origin={parseMenuOrigin(params.get("origin") ?? undefined)} />;
}

export function GalleryView() {
  const params = useSearchParams();
  const experienceId = params.get("experience");
  const selected = getPortfolio().experience.find((item) => item.id === experienceId);
  return <GalleryScreen experience={selected} origin={parseMenuOrigin(params.get("origin") ?? undefined)} />;
}

export function OptionsView() {
  const params = useSearchParams();
  return (
    <OptionsMenuClient
      attention={params.get("attention") ?? undefined}
      origin={parseMenuOrigin(params.get("origin") ?? undefined)}
    />
  );
}
