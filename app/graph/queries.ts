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