import express from "express";
import { SEED, URL_ACCOUNT_APP } from "@common/utils/config";
import jwt from 'jsonwebtoken';
import DiscordOauth2 from "discord-oauth2";
import { UsersService } from "@routes/users/services/users.service";
import OAuth from "discord-oauth2";
import { randomstring } from "@common/utils/helpers";

export const discord = () => {
  return new DiscordOauth2({
    clientId: '991020928043450369',
    clientSecret: 'uBJJYK8aCJbnC1NI5xsOOm_XkJJt8p_V',
    redirectUri: `${URL_ACCOUNT_APP}/callback/discord`
  });
}

export const generateDiscordUrl = async (res: express.Response): Promise<string> => {
  const url = discord().generateAuthUrl({
    scope: ['identify', 'email']
  });

  return url;
}

export const getUserDiscord = async (userDiscord: OAuth.User, data: OAuth.TokenRequestResult, res: express.Response) => {
  const usersService = UsersService.getInstance();
  let token;
  
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;
  const userExist = await usersService.getOneByQuery({ $or: [{ discordID: userDiscord.id }, { email: userDiscord.email }] });

  if (!!userExist) {
    userExist.username = `${userDiscord.username}#${userDiscord.discriminator}`;
    userExist.name = userDiscord.username;
    userExist.email = userDiscord.email || '';
    userExist.avatar = `https://cdn.discordapp.com/avatars/${userDiscord.id}/${userDiscord.avatar}.png`;
    userExist.accessToken = accessToken;
    userExist.refreshToken = refreshToken;
    userExist.discordID = userDiscord.id;
    userExist.loggedWith = 'discord';
    await userExist.save();

    token = jwt.sign({
      user: {
        _id: userExist._id,
        username: userExist.username,
        name: userExist.name,
        avatar: userExist.avatar,
        role: userExist.role,
      }
    }, SEED || '', { expiresIn: process.env.EXPIRES_TOKEN })
  } else {
    const code = randomstring(10);

    const user = {
      username: `${userDiscord.username}#${userDiscord.discriminator}`,
      name: userDiscord.username,
      email: userDiscord.email || '',
      code,
      avatar: `https://cdn.discordapp.com/avatars/${userDiscord.id}/${userDiscord.avatar}.png`,
      status: 'active',
      discordID: userDiscord.id,
      accessToken,
      refreshToken,
      loggedWith: 'discord'
    };

    const newUser = await usersService.create(user);

    token = jwt.sign({
      user: {
        _id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        avatar: newUser.avatar,
        role: newUser.role,
      }
    }, SEED || '', { expiresIn: process.env.EXPIRES_TOKEN })
  }

  return {
    token,
    tokenType: 'bearer',
    expiresIn: process.env.EXPIRES_TOKEN
  };
}