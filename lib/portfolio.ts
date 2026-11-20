import portfolioData from "@/content/portfolio.json";

type Movie = {
  title: string;
  director?: string;
  creator?: string;
  year: number;
  note?: string;
  kind?: "movie" | "show";
};
type Reading = {
  title: string;
  author: string;
  status: "reading" | "finished" | "coursework" | "queue";
  category?: string;
};
type Music = {
  album: string;
  artist: string;
  url: string;
  kind?: "performance" | "listening";
  status?: "learning" | "preparing" | "planned" | "recorded" | "coming-soon";
};
type Travel = { place: string; date: string; note: string };
type SideQuest = {
  id: string;
  title: string;
  achievement: string;
  period?: string;
  description: string;
  skills?: string[];
  links?: { label: string; url: string }[];
};
type ExternalLink = { label: string; url: string };

type Experience = Omit<(typeof portfolioData)["experience"][number], never> & {
  media?: { type?: string; src: string; title: string; blurb?: string; egg?: boolean }[];
};
type Reading2 = { title: string; author: string };
type MusicRec = { album: string; artist: string; url: string };
type HomeWidgets = {
  recentNews: { text: string; url: string };
  currentlyReading: Reading2[];
  recentMovies: Movie[];
  musicRecs: MusicRec[];
  favouriteSong: { title: string; artist: string; url: string } | null;
};

export type Portfolio = Omit<typeof portfolioData, "activities" | "homeWidgets" | "links" | "experience"> & {
  experience: Experience[];
  activities: {
    reading: Reading[];
    music: Music[];
    movies: Movie[];
    travel: Travel[];
    sideQuests: SideQuest[];
  };
  homeWidgets: HomeWidgets;
  links: ExternalLink[];
};

export function getPortfolio(): Portfolio {
  return portfolioData as Portfolio;
}

export function getFavouriteSong() {
  const song = (portfolioData.homeWidgets as HomeWidgets).favouriteSong;
  if (!song?.title) return null;
  return song;
}

export function getRecentMovie(): Movie | null {
  const movies = (portfolioData.homeWidgets as HomeWidgets).recentMovies;
  if (!movies.length) return null;
  return movies[movies.length - 1];
}
