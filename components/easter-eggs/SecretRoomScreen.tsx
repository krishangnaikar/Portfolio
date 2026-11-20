"use client";

import { useEasterEggs } from "@/components/easter-eggs/EasterEggProvider";
import McMenuScreen from "@/components/mc/McMenuScreen";
import { useMcSound } from "@/hooks/useMcSound";
import { useEffect, useState } from "react";

// Placeholder art. Swap in real photos (public/secret-room/) and captions.
const ALBUM = [
  { src: "/resource-packs/computer-science.png", title: "Where the code lives." },
  { src: "/resource-packs/data-tools.png", title: "Where the models train." },
  { src: "/resource-packs/physics.png", title: "Where the qubits are." },
  { src: "/resource-packs/sjsu.png", title: "Home base: SJSU." },
] as const;

export default function SecretRoomScreen() {
  const { found, complete, ready } = useEasterEggs();
  const { playClick } = useMcSound();
  const [open, setOpen] = useState<(typeof ALBUM)[number] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <McMenuScreen title={complete || !ready ? "Secret Room" : "Locked Room"} doneHref="/" wide>
      <div className="mc-secret-room">
        {!ready ? null : complete ? (
          <>
            <div className="mc-secret-credits">
              <h2>The Secret Room</h2>
              <p>Built by Krishang Naikar</p>
              <p>Inspired by classic Minecraft interfaces and my own life experiences.</p>
              <p>Thanks for looking closely enough to find everything :D</p>
            </div>
            <div className="mc-gallery mc-secret-album">
              <p className="mc-gallery__intro">A few photos, in order.</p>
              <div className="mc-gallery__grid mc-secret-album__grid">
                {ALBUM.map((item, index) => (
                  <button
                    type="button"
                    className="mc-gallery__slot"
                    key={item.src}
                    onClick={() => {
                      playClick();
                      setOpen(item);
                    }}
                  >
                    <img src={item.src} alt="" />
                    <span className="mc-gallery__caption">
                      {String(index + 1).padStart(2, "0")} · {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="mc-secret-locked">
            Find all five discoveries to open this room. Current count: {found.length}/5
          </p>
        )}
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
