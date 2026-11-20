"use client";

import { ConfirmLink } from "@/components/ExternalConfirmProvider";
import McMenuScreen from "@/components/mc/McMenuScreen";
import type { Portfolio } from "@/lib/portfolio";
import { originHref, type MenuOrigin } from "@/lib/menuNavigation";
import { needsExternalConfirm } from "@/lib/externalLinks";
import { useMcSound } from "@/hooks/useMcSound";

export default function ContactScreen({ data, origin }: { data: Portfolio; origin: MenuOrigin }) {
  const { playClick } = useMcSound();
  const contact = data.contact as Record<string, string | undefined>;
  const handle = (url?: string) => (url ? url.replace(/\/+$/, "").split("/").pop() ?? url : "");
  const rows: { icon: string; label: string; value: string; href: string }[] = [
    ...(contact.email ? [{ icon: "letter", label: "Email", value: contact.email, href: `mailto:${contact.email}` }] : []),
    ...(contact.phone
      ? [{ icon: "redstone", label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\D/g, "")}` }]
      : []),
    ...(contact.linkedin ? [{ icon: "map", label: "LinkedIn", value: handle(contact.linkedin), href: contact.linkedin }] : []),
    ...(contact.github ? [{ icon: "pickaxe", label: "GitHub", value: handle(contact.github), href: contact.github }] : []),
    ...(contact.scholar ? [{ icon: "book", label: "Google Scholar", value: data.name, href: contact.scholar }] : []),
    ...(contact.calendly ? [{ icon: "clock", label: "Book a call", value: "Choose a time", href: contact.calendly }] : []),
  ];

  return (
    <McMenuScreen title="Contact Me!" doneHref={originHref(origin)} wide>
      <div className="mc-contact-grid">
        {rows.map((row) => {
          const body = (
            <>
              <span className={`mc-contact-card__icon mc-contact-card__icon--${row.icon}`} aria-hidden="true" />
              <span>
                <strong>{row.label}</strong>
                <small>{row.value}</small>
              </span>
            </>
          );
          if (needsExternalConfirm(row.href)) {
            return (
              <ConfirmLink key={row.href} href={row.href} className="mc-contact-card">
                {body}
              </ConfirmLink>
            );
          }
          return (
            <a key={row.href} href={row.href} className="mc-contact-card" onClick={() => playClick()}>
              {body}
            </a>
          );
        })}
      </div>
    </McMenuScreen>
  );
}
