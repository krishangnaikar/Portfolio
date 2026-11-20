"use client";

import { ConfirmLink } from "@/components/ExternalConfirmProvider";
import { McTab } from "@/components/McButton";
import PixelIcon from "@/components/PixelIcon";
import McMenuScreen from "@/components/mc/McMenuScreen";
import type { ActivityTab } from "@/lib/activityTabs";
import type { Portfolio } from "@/lib/portfolio";
import Image from "next/image";
import { useMemo, useState } from "react";

type Tab = ActivityTab;

const QUEST_VISUALS: Record<string, { src: string; alt: string; contain?: boolean }> = {};

const READING_VISUALS: Record<string, string> = {};

const MUSIC_VISUALS: Record<string, string> = {};

const MOVIE_VISUALS: Record<string, string> = {};

function ActivityThumbnail({ src, alt, poster }: { src?: string; alt: string; poster?: boolean }) {
  return (
    <span className={`mc-row__thumbnail${poster ? " mc-row__thumbnail--poster" : ""}`}>
      {src ? <Image src={src} alt={alt} fill sizes={poster ? "48px" : "64px"} unoptimized /> : <span aria-hidden="true">?</span>}
    </span>
  );
}

const READING_ORDER: Record<Portfolio["activities"]["reading"][number]["status"], number> = {
  reading: 0,
  queue: 1,
  coursework: 2,
  finished: 3,
};

const STATUS_LABEL: Record<Portfolio["activities"]["reading"][number]["status"], string> = {
  reading: "reading",
  queue: "on the shelf",
  coursework: "coursework",
  finished: "finished",
};

const PIECE_STATUS: Record<NonNullable<Portfolio["activities"]["music"][number]["status"]>, string> = {
  learning: "learning",
  preparing: "performing next semester",
  planned: "up next",
  recorded: "recorded",
  "coming-soon": "videos coming soon",
};

export default function ActivitiesClient({
  activities,
  initialTab = "sideQuests",
  title = "Extracurriculars",
  doneHref = "/",
}: {
  activities: Portfolio["activities"];
  initialTab?: Tab;
  title?: string;
  doneHref?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

  // Side Quests is the default screen, so it comes first.
  const allTabs: { id: Tab; label: string }[] = [
    { id: "sideQuests", label: "Side Quests" },
    { id: "reading", label: "Reading" },
    { id: "music", label: "Music" },
    { id: "movies", label: "Movies & Shows" },
    { id: "travel", label: "Travel" },
  ];
  // Only show tabs that have content, so empty sections never appear.
  const tabs = allTabs.filter((t) => t.id === "sideQuests" || (activities[t.id]?.length ?? 0) > 0);

  const reading = useMemo(
    () =>
      [...activities.reading].sort(
        (a, b) => READING_ORDER[a.status] - READING_ORDER[b.status] || a.title.localeCompare(b.title)
      ),
    [activities.reading]
  );

  const sideQuests = activities.sideQuests ?? [];

  return (
    <McMenuScreen title={title} doneHref={doneHref} wide>
      <div className="mc-menu-content mc-activities-content">
        <div className="mc-tabs">
          {tabs.map((t) => (
            <McTab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </McTab>
          ))}
        </div>

        {tab === "reading" &&
          reading.map((book) => (
            <div key={`${book.title}-${book.author}`} className="mc-row" style={{ cursor: "default" }}>
              <ActivityThumbnail
                src={READING_VISUALS[book.title]}
                alt={`${book.title} cover`}
              />
              <div className="mc-row__main">
                <div className="mc-row__title">
                  <PixelIcon name={book.status === "finished" ? "check" : book.status === "reading" ? "book" : "books"} />
                  {book.title}
                </div>
                <div className="mc-row__sub">
                  {book.author}
                  {book.category ? ` · ${book.category}` : ""}
                </div>
              </div>
              <div className="mc-row__meta">{STATUS_LABEL[book.status]}</div>
            </div>
          ))}

        {tab === "music" &&
          activities.music.map((m) => (
            <div key={`${m.album}-${m.artist}`} className="mc-row" style={{ cursor: "default" }}>
              <ActivityThumbnail
                src={MUSIC_VISUALS[m.album]}
                alt={`${m.artist} portrait`}
              />
              <div className="mc-row__main">
                <div className="mc-row__title">
                  <PixelIcon name={m.kind === "performance" ? "piano" : "note"} />
                  {m.album}
                </div>
                <div className="mc-row__sub">
                  {m.artist}
                  {m.status && m.kind === "performance" ? ` · ${PIECE_STATUS[m.status]}` : ""}
                </div>
              </div>
              {m.url ? (
                <ConfirmLink href={m.url} className="news-widget__link">
                  YouTube
                </ConfirmLink>
              ) : m.status === "coming-soon" ? (
                <span className="mc-row__meta">soon</span>
              ) : null}
            </div>
          ))}

        {tab === "movies" &&
          activities.movies.map((m) => (
            <div key={m.title} className="mc-row" style={{ cursor: "default" }}>
              <ActivityThumbnail
                src={MOVIE_VISUALS[m.title]}
                alt={`${m.title} poster`}
                poster
              />
              <div className="mc-row__main">
                <div className="mc-row__title">
                  <PixelIcon name="movie" />
                  {m.title}
                </div>
                <div className="mc-row__sub">
                  {m.kind === "show"
                    ? m.creator
                      ? `${m.creator}, ${m.year}`
                      : `${m.year}`
                    : m.director
                      ? `d. ${m.director}, ${m.year}`
                      : `${m.year}`}
                </div>
              </div>
            </div>
          ))}

        {tab === "travel" &&
          activities.travel.map((t) => (
            <div key={t.place} className="mc-row" style={{ cursor: "default" }}>
              <ActivityThumbnail
                src={undefined}
                alt={t.place}
              />
              <div className="mc-row__main">
                <div className="mc-row__title">
                  <PixelIcon name="globe" />
                  {t.place}
                </div>
                <div className="mc-row__sub">{t.note}</div>
              </div>
              <div className="mc-row__meta">{t.date}</div>
            </div>
          ))}

        {tab === "sideQuests" &&
          <div className="side-quest-grid">
            {sideQuests.map((quest) => {
              const visual = QUEST_VISUALS[quest.id];
              const expanded = expandedQuest === quest.id;

              return (
                <article
                  key={quest.id}
                  className={`side-quest-card${expanded ? " side-quest-card--expanded" : ""}`}
                >
                  <button
                    type="button"
                    className="side-quest-card__toggle"
                    aria-expanded={expanded}
                    onClick={() => setExpandedQuest(expanded ? null : quest.id)}
                  >
                    <span className="side-quest-card__visual">
                      {visual && (
                        <Image
                          src={visual.src}
                          alt={visual.alt}
                          fill
                          sizes="(max-width: 640px) 90vw, 300px"
                          className={visual.contain ? "side-quest-card__image--contain" : ""}
                        />
                      )}
                    </span>
                    <span className="side-quest-card__summary">
                      <strong>{quest.title}</strong>
                      <span>{quest.achievement}</span>
                      <span className="side-quest-card__prompt">
                        {expanded ? "Close details ←" : "Open details →"}
                      </span>
                    </span>
                  </button>

                  {expanded && (
                    <div className="side-quest-card__details">
                      <p>{quest.description}</p>
                      {quest.skills && (
                        <div className="side-quest-row__tags">
                          {quest.skills.map((skill) => (
                            <span key={skill} className="mc-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {quest.links?.map((link) =>
                        link.url.includes("PASTE_") ? null : (
                          <ConfirmLink
                            key={link.label}
                            href={link.url}
                            className="news-widget__link side-quest-row__link"
                          >
                            {link.label} →
                          </ConfirmLink>
                        )
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>}
      </div>
    </McMenuScreen>
  );
}
