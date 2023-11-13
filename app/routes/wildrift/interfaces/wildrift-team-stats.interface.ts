import { Document } from "mongoose";

export interface WildRiftStat extends Document {
  matchId: string,
  teamDivisionId: string,
  teamType: string,
  setOrder: number,
  winner: boolean,
  isComplete: boolean,
  kills: number,
  deaths: number,
  assistants: number,
  kda: number,
  extermination: number,
  turrets: number,
  firstBlood: boolean,
  herald: number,
  baron: number,
  drakes: string[]
}