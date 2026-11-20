"use client";

import { useEasterEggs } from "@/components/easter-eggs/EasterEggProvider";
import McMenuScreen from "@/components/mc/McMenuScreen";
import type { Portfolio } from "@/lib/portfolio";
import { originHref, type MenuOrigin } from "@/lib/menuNavigation";
import { useEffect, useState } from "react";

type GalleryItem = {
  src: string;
  title: string;
  blurb?: string;
  egg?: boolean;
};

type Experience = Portfolio["experience"][number];

// Placeholder art. Replace these with real photos (put files in public/gallery/) and edit the captions.
const GENERAL_MEDIA: GalleryItem[] = [
  { src: "/resource-packs/computer-science.png", title: "Computer Science", blurb: "Compilers, RAG pipelines and a lot of Python." },
  { src: "/resource-packs/data-tools.png", title: "Data and ML", blurb: "Fine-tuning, datasets and evaluation." },
  { src: "/resource-packs/physics.png", title: "Quantum", blurb: "Qiskit contributions and a redstone qubit.", egg: true },
  { src: "/resource-packs/sjsu.png", title: "SJSU", blurb: "Spartans, what is your profession?!" },
];

export default function GalleryScreen({
  experience,
  origin,
}: {
  experience?: Experience;
  origin: MenuOrigin;
}) {
  const { discover } = useEasterEggs();
  const media: GalleryItem[] = experience?.media?.map((item) => ({
    src: item.src,
    title: item.title,
    blurb: "blurb" in item && typeof item.blurb === "string"
      ? item.blurb
      : `${item.title}. Full-size stills and captions go here once the real photos land.`,
    egg: "egg" in item && Boolean(item.egg),
  })) ?? GENERAL_MEDIA;
  const [open, setOpen] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openItem = (item: GalleryItem) => {
    setOpen(item);
    if (item.egg) discover("gallery");
  };

  return (
    <McMenuScreen
      title={experience ? `${experience.company} Media` : "Photos"}
      doneHref={originHref(origin)}
      wide
    >
      <div className="mc-gallery">
        <p className="mc-gallery__intro">
          {experience
            ? "Tap a still to open it full-screen."
            : "Tap a photo to open a larger view and a short caption."}
        </p>
        <div className="mc-gallery__grid">
          {media.map((item, index) => (
            <button
              type="button"
              className={`mc-gallery__slot${item.egg ? " mc-gallery__slot--egg" : ""}`}
              key={`${item.src}-${item.title}`}
              onClick={() => openItem(item)}
            >
              <img src={item.src} alt="" />
              <span className="mc-gallery__caption">
                {String(index + 1).padStart(2, "0")} · {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="mc-lightbox" role="dialog" aria-modal="true" aria-label={open.title}>
          <button type="button" className="mc-lightbox__backdrop" onClick={() => setOpen(null)} aria-label="Close photo" />
          <div className="mc-lightbox__frame">
            <div className="mc-lightbox__photo">
              <img src={open.src} alt={open.title} />
            </div>
            <div className="mc-lightbox__copy">
              <strong>{open.title}</strong>
              <p>{open.blurb}</p>
            </div>
            <button type="button" className="mc-button" onClick={() => setOpen(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </McMenuScreen>
  );
}
