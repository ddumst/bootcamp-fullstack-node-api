import { Document } from "mongoose";

export interface WildRiftBuildVote extends Document {
  userId: string;
  buildId: string;
}
