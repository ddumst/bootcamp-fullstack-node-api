import { Document } from "mongoose";

export interface WildRiftChamp extends Document {
  name: string,
  slug: string,
  avatarUrl: string,
  thumbUrl: string,
  splashUrl: string,
  bannerUrl: string,
  skills?: WildRiftChampSkill[]
}

export interface WildRiftChampSkill {
  name: string,
  image: string
}