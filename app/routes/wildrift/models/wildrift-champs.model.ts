import { model, Schema } from 'mongoose';
import { WildRiftChamp } from '../interfaces/wildrift-champs.interface';

const wildRiftChamp = new Schema({
  name: {
    type: String,
    unique: true,
  },
  slug: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  thumbUrl: {
    type: String,
    required: true
  },
  splashUrl: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    required: true
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

export const WildRiftChamps = model<WildRiftChamp>('WildRiftChamps', wildRiftChamp);
