import { apgGraphQL } from "./apgApi"
import { operationProfileVideo } from "./queries";
import { RequestError } from "./account.endpoints";
import { YoutubeChannel } from "@routes/users/interfaces/videos.interface";
import { EditProfileSetProps } from "@routes/users/interfaces/user.interface";

export const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const insert = async ({ data: userVideo, userId, token }: EditProfileSetProps<Partial<any>>): Promise<YoutubeChannel> => {
  const { data: { insertYoutubeChannel }, errors: er } = await apgGraphQL(
    operationProfileVideo,
    'InsertYoutubeChannel',
    {
      "object": userVideo
    },
    token
  )

  if (er) {
    throw getError(er[0] as RequestError)
  }

  if (!insertYoutubeChannel) {
    throw getError({
      title: 'Error',
      message: 'Video not found',
      response: {
        status: 404
      }
    })
  }

  const { id } = insertYoutubeChannel;

  const { data, errors } = await apgGraphQL(
    operationProfileVideo,
    'InsertUserVideo',
    {
      "object": {
        youtubeChannelId: id,
        isActive: true,
      }
    },
    token
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return data.insertUserVideo;
}

const update = async ({ data: userVideo, userId, token }: EditProfileSetProps<Partial<any>>): Promise<YoutubeChannel> => {
  const { youtubeChannelId, ...rest } = userVideo;
  const { data: updateUserPartner, errors: er } = await apgGraphQL(
    operationProfileVideo,
    'UpdateUserVideo',
    {
      "_set": {
        "isActive": rest.isActive
      },
      "userId": userId,
      "youtubeChannelId": youtubeChannelId
    },
    token
  )

  if (er) {
    throw getError(er[0] as RequestError)
  }

  if (!updateUserPartner) {
    throw getError({
      title: 'Error',
      message: 'Video not found',
      response: {
        status: 404
      }
    })
  }

  const { data, errors } = await apgGraphQL(
    operationProfileVideo,
    'UpdateYoutubeChannel',
    {
      "_set": rest,
      "id": youtubeChannelId,
    },
    token
  )

  if (errors) {
    throw getError(er[0] as RequestError)
  }

  return data.updateYoutubeChannel;
}

export const VideosEndpoints = {
  insert,
  update
}
