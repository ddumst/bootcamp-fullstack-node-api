import { Document } from "mongoose";
import { WildRiftChamp } from "./wildrift-champs.interface";

export interface WildRiftPlayerStat extends Document {
  playerNumber: number,
  matchId: string,
  memberId: string,
  teamDivisionId: string,
  champId: string,
  setOrder: number,
  kills: number,
  deaths: number,
  assistants: number,
  kda: number,
  killParticipation: number,
  gold: number,
  mvp: boolean
}

export interface PlayerOverviewStat {
  teamDivisionId: string,
  memberId: string,
  kills: number,
  assistants: number,
  killAssistants: number,
  champId: string,
  kda: number,
  killParticipation: string
  champ?: Partial<WildRiftChamp>,
}