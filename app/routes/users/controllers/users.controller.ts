import express from "express";
import { cache } from '@common/services/cache.service';
import AWS from "aws-sdk";
import crypto from 'crypto';
import { AccountEndpoints } from '@graph/account.endpoints';

export class UsersController {
  constructor() {}

  upload = async (req: any, res: express.Response) => {
    const file = req?.files?.["file"] || null
    const userId = req.params.userId;
    const imageType = req.params.imageType;
    const user = req.user;
    const authToken = req.authToken;
    const timestamp = Date.now().toString();

    if (userId !== user.id) return res.status(401).json({ error: 'No tienes permiso para realizar esta acción.' });

    const getUserData = await AccountEndpoints.getUserAccount(userId);

    if (!getUserData) return res.status(401).json({ error: 'No se pudo obtener la información de tu usuario.' });

    const s3 = new AWS.S3({
      endpoint: "https://usc1.contabostorage.com/apg",
      accessKeyId: "38d173324e6c0e84873d1594d33b99b2",
      secretAccessKey: "dc7d01478a8a43e421b66524459e06b1",
      s3BucketEndpoint: true,
    });

    // Return if the request doesn't contain the file
    if(!file) return res.sendStatus(400).json({ error: 'No se envió ningun archivo.' });

    const hash = crypto.createHash('sha256').update(`${userId}-${imageType}-${timestamp}`).digest('hex');

    const { name, mimetype, size, data } = file
    const fileContent  = Buffer.from(data, 'binary');

    const uploadParams = {
      Bucket: 'apg',
      Key: `${hash}.${name.split('.').pop()}`,
      Body: fileContent,
    };

    const image = imageType === 'profile' ? getUserData.profileImage : getUserData.bannerImage;

    const deleteParams = {
      Bucket: 'apg',
      Key: image?.split('/').pop() || '',
    };
  
    // Subir el archivo a Contabo Object Storage
    s3.upload(uploadParams, async (err: any, data: any) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      // Construir la URL del objeto en Contabo Object Storage utilizando el Etag
      const imageUrl = `https://storage.apg.gg/${uploadParams.Key}`;

      if (imageUrl) {
        if (image) {
          s3.deleteObject(deleteParams, (err: any, data: any) => {
            if (err) {
              console.error('Error al eliminar el archivo:', err);
              return res.status(500).json({ error: 'Error al eliminar el archivo' });
            }
          });
        }

        if (imageType === 'profile') {
          await AccountEndpoints.updateUserAccount(userId, { profileImage: imageUrl }, authToken);
        } else {
          await AccountEndpoints.updateUserAccount(userId, { bannerImage: imageUrl }, authToken);
        }
        
        return res.json({
          url: imageUrl,
          message: 'Archivo subido correctamente.'
        });
      }
    });
  }

  uploadFile = async (req: any, res: express.Response) => {
    const file = req?.files?.["file"] || null
    const fileType = req.params.fileType;
    const user = req.user;
    const timestamp = Date.now().toString();

    const s3 = new AWS.S3({
      endpoint: "https://usc1.contabostorage.com/apg",
      accessKeyId: "38d173324e6c0e84873d1594d33b99b2",
      secretAccessKey: "dc7d01478a8a43e421b66524459e06b1",
      s3BucketEndpoint: true,
    });

    // Return if the request doesn't contain the file
    if(!file) return res.sendStatus(400).json({ error: 'No se envió ningun archivo.' });

    const hash = crypto.createHash('sha256').update(`${user.id}-${fileType}-${timestamp}`).digest('hex');

    const { name, mimetype, size, data } = file
    const fileContent  = Buffer.from(data, 'binary');

    const uploadParams = {
      Bucket: 'apg',
      Key: `${hash}.${name.split('.').pop()}`,
      Body: fileContent,
    };
  
    // Subir el archivo a Contabo Object Storage
    s3.upload(uploadParams, async (err: any, data: any) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      // Construir la URL del objeto en Contabo Object Storage utilizando el Etag
      const imageUrl = `https://storage.apg.gg/${uploadParams.Key}`;

      if (imageUrl) {
        return res.json({
          url: imageUrl,
          message: 'Archivo subido correctamente.'
        });
      }
    });
  }
}
