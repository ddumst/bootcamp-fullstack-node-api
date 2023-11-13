import { Document } from "mongoose";

export interface WildRiftBan extends Document {
  matchId: string,
  teamDivisionId: string,
  teamType: string,
  setOrder: number,
  ban: string,
  banNumber: number,
  season: number
}