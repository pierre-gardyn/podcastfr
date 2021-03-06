import { Podcast } from './jtd/podcast';

export interface LogoColors {
  vibrant: string | null;
  darkVibrant: string | null;
  lightVibrant: string | null;
  muted: string | null;
  darkMuted: string | null;
  lightMuted: string | null;
}

export interface EpisodeDate {
  publishingDate: string;
}

export interface PodcastExtra extends Podcast {
  extra: {
    colors: LogoColors;
    episodes: EpisodeDate[];
  };
}
