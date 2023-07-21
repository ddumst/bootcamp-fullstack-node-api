export interface Colors {
  primary: string;
  secondary: string;
}

export interface Socials {
  facebook: string;
  twitter: string;
  discord: string;
  twitch: string;
  youtube: string;
  instagram: string;
  contact: string;
}

export interface BitlyShorten {
  link: string,
  id: string,
  long_url: string,
  archived: boolean,
}

export interface Stats {
  wins: number,
  ties: number,
  losts: number,
  winRate: number,
  setsW?: number,
  setsL?: number,
  setsDiff?: number,
  gamesW?: number,
  gamesL?: number,
  gamesDiff?: number,
  points?: number,
  customStats?: any
}