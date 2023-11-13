import { Document } from "mongoose";
import { WildRiftChamp } from "./wildrift-champs.interface";

export interface WildRiftPick extends Document {
  matchId: string,
  teamDivisionId: string,
  teamType: string,
  setOrder: number,
  pick: string,
  pickNumber: number,
  lane: string,
  season: number,
  winner: boolean,
}

export interface WildRiftChampStat extends Document {
  name: string,
  slug: string,
  avatarUrl: string,
  thumbUrl: string,
  splashUrl: string,
  bannerUrl: string,
  bans: number,
  lane: string,
  role: string,
  kda: number,
  kills: number,
  deaths: number,
  assistants: number,
  winRate: number,
  pickRate: number,
  matchPlayed: number,
  champ: WildRiftChamp
}