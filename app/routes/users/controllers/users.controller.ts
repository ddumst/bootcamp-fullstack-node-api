import express from "express";
import sizeOf from "image-size";
import AWS from "aws-sdk";
import crypto from 'crypto';
import { AccountEndpoints, RequestError, getError } from '@graph/account.endpoints';
import { FileEndpoints } from "@graph/file.endpoints";
import getYoutubeChannelIdFromUrl from "@common/utils/getYoutubeChannelIdFromUrl";
import { VideosEndpoints } from "@graph/profile-videos.endpoints";
import parse from "rss-to-json";
import { GamesEndpoints } from "@graph/profile-games.endpoints";
import { apgGraphQL } from "@graph/apgApi";
import { operationProfileGame } from "@graph/queries";

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
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      // Construir la URL del objeto en Contabo Object Storage utilizando el Etag
      const imageUrl = `https://storage.apg.gg/${uploadParams.Key}`;

      if (imageUrl) {
        if (image) {
          s3.deleteObject(deleteParams, (err: any, data: any) => {
            if (err) {
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

    const { name, data } = file;
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

  uploadFiles = async (req: any, res: express.Response) => {
    const files: Record<string, any> = req?.files || null;
    const user = req.user;
    const authToken = req.authToken;
  
    const s3 = new AWS.S3({
      endpoint: "https://usc1.contabostorage.com/apg",
      accessKeyId: "38d173324e6c0e84873d1594d33b99b2",
      secretAccessKey: "dc7d01478a8a43e421b66524459e06b1",
      s3BucketEndpoint: true,
    });
  
    // Return if the request doesn't contain any files
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No se envió ningún archivo.' });
    }
  
    const promises: Promise<any>[] = [];
  
    for (const fieldName in files) {
      const file = files[fieldName];
  
      if (Array.isArray(file)) {
        // If there are multiple files with the same field name (up to 10), process each one
        for (const singleFile of file) {
          promises.push(uploadSingleFile(singleFile));
        }
      } else {
        promises.push(uploadSingleFile(file));
      }
    }
  
    try {
      const results = await Promise.all(promises);
      const imageUrls = results.filter((result) => result.imageUrl);
  
      return res.json({
        urls: imageUrls,
        message: 'Archivos subidos correctamente.',
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error al subir archivos.' });
    }
  
    async function uploadSingleFile(file: any): Promise<{ id?: number, imageUrl?: string, error?: string }> {
      return new Promise((resolve, reject) => {
        const timestamp: string = Date.now().toString();
        const { name, mimetype, size, data } = file;
        const dimensions = sizeOf(file.data);
        const fileContent  = Buffer.from(data, 'binary');
        const hash = crypto.createHash('sha256').update(`${user.id}-${name}-${timestamp}`).digest('hex');

        const uploadParams: AWS.S3.PutObjectRequest = {
          Bucket: 'apg',
          Key: `${hash}.${name.split('.').pop()}`,
          Body: fileContent,
          ContentType: mimetype,
        };
  
        // Upload the file to Contabo Object Storage
        s3.upload(uploadParams, async (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            resolve({ error: 'Error al subir el archivo' });
          } else {
            // Construct the URL of the object in Contabo Object Storage using the Etag
            const imageUrl: string = `https://storage.apg.gg/${uploadParams.Key}`;

            const insertedFile = await FileEndpoints.insertFile(
              {
                caption: '',
                height: dimensions.height || 0,
                name: uploadParams.Key,
                type: mimetype,
                url: imageUrl,
                width: dimensions.width || 0,
                isActive: true
              }, 
              authToken
            );

            resolve({ id: insertedFile.id, imageUrl });
          }
        });
      });
    }
  }
  
  saveYoutubeChannel = async (req: any, res: express.Response) => {
    const user = req.user;
    const authToken = req.authToken;
    const { isEditing } = req.query;
    const { channelLink, template, isActive, youtubeChannelId } = req.body;

    const channelId = await getYoutubeChannelIdFromUrl(channelLink);

    if ((channelId as RequestError)?.response?.status) {
      return res.status(400).json((channelId as RequestError));
    }

    if (isEditing === 'true') {
      try {
        const response = await VideosEndpoints.update({
          userId: user.id,
          token: authToken,
          data: {
            channelLink,
            template,
            isActive,
            channelId,
            youtubeChannelId
          }
        });
  
        if (response) {
          return res.json({
            message: "Video updated successfully"
          })
        }
      } catch (error) {
        return res.status(404).json({
          message: 'Video not found',
          code: 3051
        })
      }
    } else {
      try {
        const response = await VideosEndpoints.insert({
          userId: user.id,
          token: authToken,
          data: {
            channelLink,
            template,
            channelId,
            isActive: true
          }
        });
  
        if (response) {
          return res.json({
            message: "Video inserted successfully"
          })
        }
      } catch (error) {
        return res.status(404).json({
          message: 'Video not found',
          code: 3050
        })
      }
    }

    return res.json({});
  }

  getYoutubeVideos = async (req: any, res: express.Response) => {
    const { channelId } = req.params;

    try {
      const videos = await parse(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
      
      return res.json(videos);
    } catch (error) {
      return res.status(404).json({
        message: 'Can\'t fetch videos from this channel',
        code: 3053
      })
    }
  }

  claimBadgeFromDiscordRoleId = async (req: any, res: express.Response) => {
    const { roleId } = req.params;
  }

  getUserGames = async (req: any, res: express.Response) => {
    const authToken = req.authToken;
    const { userId, isEditing, isPrivate } = req.query;

    try {
      const userGames = await GamesEndpoints.get({
        userId: userId,
        token: authToken,
        isEditing: isEditing === "true"
      });

      const gamesMapped = userGames.map((userGame) => {
        if (isPrivate === "true" && userGame && userGame.isPrivate) {
          userGame.playerTag = '*******';
          userGame.clasification.name = '*******';
          userGame.clasification.slug = '*******';
        }

        return userGame;
      });

      return res.json(gamesMapped);
    } catch (error) {
      return res.status(400).json({
        message: (error as RequestError).message,
        code: (error as RequestError).code
      })
    }
  }

  createUserGame = async (req: any, res: express.Response) => {
    const authToken = req.authToken;
    const { input } = req.body;
    const { gameId, clasificationId, playerTag } = input.userGame;

    try {
      const insertedGame = await GamesEndpoints.insert({
        data: {
          gameId: +gameId,
          clasificationId: +clasificationId,
          playerTag: playerTag
        },
        token: authToken
      });

      if (insertedGame) {
        return res.json(insertedGame)
      }
    } catch (error) {
      return res.status(400).json({
        message: (error as RequestError).message,
        code: (error as RequestError).code
      })
    }
  }

  updateUserGame = async (req: any, res: express.Response) => {
    const user = req.user;
    const authToken = req.authToken;
    const { input } = req.body;
    const { gameId, clasificationId, playerTag, isActive, isPrivate } = input.userGame;

    try {
      const updatedGame = await GamesEndpoints.update({
        data: {
          gameId: +gameId,
          clasificationId: +clasificationId,
          playerTag: playerTag,
          isActive: isActive === "true",
          isPrivate: isPrivate === "true"
        },
        userId: user.id,
        token: authToken
      });

      if (updatedGame) {
        return res.json(updatedGame)
      }
    } catch (error) {
      return res.status(400).json({
        message: (error as RequestError).message,
        code: (error as RequestError).code
      })
    }
  }
}
