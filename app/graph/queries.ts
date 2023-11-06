export const operationGetAccountUser = `
  query GetUserAccount($id: Int! = 0) {
    user: users_by_pk(id: $id) {
      bannerImage
      birthday
      countryId
      createdAt
      email
      id
      isActive
      isBetaUser
      isVerified
      isWorker
      lastname
      name
      online
      profileImage
      showBirthday
      updatedAt
      username
    }
  }

  mutation UpdateUserAccount($id: Int!, $_set: users_set_input = {}) {
    updateUserByPk: update_users_by_pk(pk_columns: {id: $id}, _set: $_set) {
      bannerImage
      birthday
      countryId
      email
      id
      isActive
      isBetaUser
      isVerified
      isWorker
      name
      online
      profileImage
      showBirthday
      username
    }
  }
`;

export const operationFiles = `
  mutation InsertFile($object: files_insert_input = {}) {
    insertFile: insert_files_one(object: $object) {
      id
    }
  }
`;

export const operationProfileVideo = `
  query GetUserVideos($where: user_videos_bool_exp!) {
    userVideos: user_videos(where: $where) {
      userId
      isActive
      youtubeChannelId
      youtubeChannel {
        channelLink
        channelId
        template
        isActive
      }
    }
  }

  mutation InsertUserVideo($object: user_videos_insert_input = {}) {
    insertUserVideo: insert_user_videos_one(object: $object) {
      userId
      isActive
      youtubeChannelId
      id
    }
  }

  mutation InsertYoutubeChannel($object: youtube_channels_insert_input = {}) {
    insertYoutubeChannel: insert_youtube_channels_one(object: $object) {
      channelLink
      isActive
      template
      id
    }
  }

  mutation UpdateUserVideo($userId: Int!, $youtubeChannelId: Int!, $_set: user_videos_set_input!) {
    updateUserVideo: update_user_videos_by_pk(pk_columns: {userId: $userId, youtubeChannelId: $youtubeChannelId}, _set: $_set) {
      isActive
      userId
      youtubeChannelId
    }
  }

  mutation UpdateYoutubeChannel($id: Int!, $_set: youtube_channels_set_input!) {
    updateYoutubeChannel: update_youtube_channels_by_pk(pk_columns: {id: $id}, _set: $_set) {
      id
      isActive
      channelLink
      template
    }
  }
  
  mutation DeleteUserVideo($youtubeChannelId: Int!, $userId: Int!) {
    deletedUserVideo: delete_user_videos_by_pk(youtubeChannelId: $youtubeChannelId, userId: $userId) {
      id
    }
    deletedYoutubeChannel: delete_youtube_channels_by_pk(id: $youtubeChannelId) {
      id
    }
  }
`

export const operationProfileGame = `
  query GetUserGames($where: user_games_bool_exp!) {
    userGames: user_games(order_by: {order: asc}, where: $where) {
      clasificationId
      gameId
      id
      isActive
      isPrivate
      playerTag
      userId
      order
      clasification {
        image
        slug
        name
        id
      }
      game {
        banner
        id
        name
        slug
        thumbnail
      }
    }
  }

  mutation InsertUserGame($object: user_games_insert_input!) {
    insertUserGame: insert_user_games_one(object: $object) {
      clasificationId
      gameId
      id
      isActive
      isPrivate
      playerTag
      userId
    }
  }

  mutation UpdateUserGame($gameId: Int!, $userId: Int!, $_set: user_games_set_input = {}) {
    updatedUserGame: update_user_games_by_pk(pk_columns: {gameId: $gameId, userId: $userId}, _set: $_set) {
      gameId
      clasificationId
      id
      isActive
      isPrivate
      playerTag
      userId
    }
  }

  mutation DeleteUserGame($gameId: Int!, $userId: Int!) {
    deleteUserGame: delete_user_games_by_pk(gameId: $gameId, userId: $userId) {
      id
    }
  }

  query UserGameExists($where: user_games_bool_exp!) {
    userGames: user_games(where: $where) {
      id
      userId
      gameId
    }
  }
`