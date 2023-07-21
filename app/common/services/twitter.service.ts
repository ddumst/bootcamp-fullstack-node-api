import { UsersService } from '@routes/users/services/users.service';
import TwitterApi, { UserV1 } from 'twitter-api-v2';
import { SEED } from "@common/utils/config";
import jwt from 'jsonwebtoken';

interface TwitterApiAccess { 
  accessToken?: string,
  accessSecret?: string
}

export const twitter = ({ accessToken, accessSecret }: TwitterApiAccess) => {
  return new TwitterApi({ 
    appKey: 'HFYx6EsdFJI4wtRdwzQDfbhoO',
    appSecret: '6QQbadTnE29foc5dzWmNsR7XcsHDiJpSnB4YF6jqiWiT9MPuPi',
    accessToken,
    accessSecret
  });
}

export const getUserTwitter = async (currentUser: UserV1, res: Express.Response) => {
  const usersService = UsersService.getInstance();
  let token;
  
  const userExist = await usersService.getOneByQuery({ twitterID: currentUser.id });

  if (!!userExist) {
    userExist.username = currentUser.screen_name;
    userExist.name = currentUser.name;
    userExist.email = currentUser.email || '';
    userExist.avatar = currentUser.profile_image_url_https;
    userExist.twitterID = currentUser.id_str;
    userExist.loggedWith = 'twitter';
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
    let user = {
      username: currentUser.screen_name,
      name: currentUser.name,
      email: currentUser.email || '',
      avatar: currentUser.profile_image_url_https,
      status: 'active',
      twitterID: currentUser.id,
      loggedWith: 'twitter'
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
