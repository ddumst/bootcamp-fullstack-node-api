import { Document } from "mongoose";

export interface WildRiftItem extends Document {
  name: string,
  image: string,
  type: string,
  level: string
}