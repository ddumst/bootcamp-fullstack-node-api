import { WildRiftChamps } from "../models/wildrift-champs.model";

export class WildRiftChampsService {
  private static instance: WildRiftChampsService;

  constructor() {}

  static getInstance(): WildRiftChampsService {
    if (!WildRiftChampsService.instance) {
      WildRiftChampsService.instance = new WildRiftChampsService();
    }
    return WildRiftChampsService.instance;
  }

  // CRUD
  create(options: any) {
    return WildRiftChamps.create(options);
  }

  getById(champId: string) {
    return WildRiftChamps.findOne({ _id: champId });
  }

  deleteById(champId: any) {
    return WildRiftChamps.deleteOne({ _id: champId });
  }

  updateById(champId: string, options: any) {
    return WildRiftChamps.findByIdAndUpdate(champId, options, { new: true, useFindAndModify: false, runValidators: true });
  }

  listWildRiftChamps(query: any, limit: number, sort: any) {
    return WildRiftChamps.find(query)
      .limit(limit)
      .sort(sort)
      .exec();
  }

  getBySlug(slug: any) {
    return WildRiftChamps.findOne({ slug: slug })
  }
}
