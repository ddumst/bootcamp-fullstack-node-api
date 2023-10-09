import { UserGame } from "@routes/users/interfaces/games.interface";
import { RequestError } from "./account.endpoints";
import { apgGraphQL } from "./apgApi"
import { operationProfileGame } from "./queries";

export const getError = ({ title, message, response, code }: RequestError): RequestError => ({ title, message, response, code })

export interface EditProfileSetProps<T> {
  userId?: number;
  token: string;
  data: T;
}

const get = async ({ 
  userId, 
  token,
  isEditing = false
}: any): Promise<UserGame[]> => {
  const showOnlyActive = !isEditing ? { "isActive": { "_eq": true } } : {};

  const { data, errors } = await apgGraphQL(
    operationProfileGame,
    'GetUserGames',
    {
      "where": {
        "userId": { "_eq": userId },
        ...showOnlyActive
      }
    },
    token
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return data.userGames;
}

const insert = async ({ data: userGame, token }: EditProfileSetProps<Partial<any>>): Promise<UserGame> => {
  const { data: existPlayerTag } = await apgGraphQL(
    operationProfileGame,
    'UserGameExists',
    {
      "where": {
        "gameId": { "_eq": userGame.gameId },
        "playerTag": { "_eq": userGame.playerTag }
      }
    },
    token
  )

  if (existPlayerTag.userGames.length > 0) {
    throw getError({
      title: "Player tag exists",
      message: "Player tag exists",
      response: {
        status: 404,
      },
      code: 4052
    })

  }
  
  const { data, errors } = await apgGraphQL(
    operationProfileGame,
    'InsertUserGame',
    {
      "object": userGame
    },
    token
  )

  if (errors) {
    throw getError({
      ...errors[0],
      code: 4050
    } as RequestError)
  }

  return data.insertUserGame;
}

const update = async ({ data: userGame, userId, token }: EditProfileSetProps<Partial<any>>): Promise<UserGame> => {
  const { data, errors } = await apgGraphQL(
    operationProfileGame,
    'UpdateUserGame',
    {
      "_set": userGame,
      "gameId": userGame.gameId,
      "userId": userId
    },
    token
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return data.updatedUserGame;
}

const remove = async ({ gameId, userId, token }: any): Promise<boolean> => {
  const { errors } = await apgGraphQL(
    operationProfileGame,
    'DeleteUserGame',
    {
      "gameId": gameId,
      "userId": userId
    },
    token
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return true;
}

export const GamesEndpoints = {
  get,
  insert,
  update,
  remove
}