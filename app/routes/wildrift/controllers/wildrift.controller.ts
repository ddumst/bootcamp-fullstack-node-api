import express from "express";
import _ from "underscore";
import { handlerMessageError } from "@common/utils/error-handler";
import { WildRiftChampsService } from "../services/wildrift-champs.service";
import slugtify from "@common/utils/slugtify";

export class WildRiftController {
  constructor() {}

  async listChamps(req: express.Request, res: express.Response) {
    const limit = Number(req.query.limit) || 200;

    const wildRiftChampsService = WildRiftChampsService.getInstance();
    const champs = await wildRiftChampsService.listWildRiftChamps({}, limit, 'name');

    if (champs && !champs.length) {
      return res.status(400).json({
        error: {
          message: 'No hay juegos que cumplan con los filtros.'
        }
      });
    }

    res.status(200).send(champs);
  }

  async getChampById(req: express.Request, res: express.Response) {
    const wildRiftChampsService = WildRiftChampsService.getInstance();
    const champ = await wildRiftChampsService.getById(req.params.champId);

    if(!champ) {
      return handlerMessageError('', 'El campeón que buscas no existe o fue eliminado del juego.', res);
    }

    res.status(200).json(champ)
  }

  async updateChampById(req: express.Request, res: express.Response) {
    const wildRiftChampsService = WildRiftChampsService.getInstance();
    const champId = req.params.champId;
    const { 
      name,
      avatarUrl,
      thumbUrl,
      splashUrl,
      bannerUrl 
    } = req.body;

    const champ = await wildRiftChampsService.updateById(champId, {
      name,
      avatarUrl,
      thumbUrl,
      splashUrl,
      bannerUrl,
      slug: slugtify(name)
    });

    if(!champ) {
      const newChamp = await wildRiftChampsService.create({
        name,
        avatarUrl,
        thumbUrl,
        splashUrl,
        bannerUrl,
        slug: slugtify(name)
      });

      return res.status(200).json({
        message: 'Campeón creado correctamente.',
        champ: newChamp
      })
    }

    res.status(200).json({
      message: 'Campeón actualizado correctamente.',
      champ
    })
  }

  async deleteById(req: express.Request, res: express.Response) {
    const wildRiftChampsService = WildRiftChampsService.getInstance();
    const champId = req.params.champId;

    const champ = await wildRiftChampsService.deleteById(champId);

    if(!champ) {
      return handlerMessageError('', 'El campeón que buscas no existe o fue eliminado del juego.', res, 204);
    }

    res.status(200).json({
      message: 'Campeón eliminado correctamente.'
    })
  }
}
