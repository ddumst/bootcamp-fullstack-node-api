import { ApgUser } from "@routes/users/interfaces/user.interface";
import { apgGraphQL } from "./apgApi"
import { operationGetAccountUser } from "./queries";

export interface RequestError {
  response: {
    status: number;
  },
  title: string,
  message: string,
  code?: string | number
}

export const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const getUserAccount = async (userId: number): Promise<ApgUser> => {
  const { data, errors } = await apgGraphQL(
    operationGetAccountUser,
    'GetUserAccount',
    {
      "id": userId
    }
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return data.user;
}

const updateUserAccount = async (userId: number, set: Partial<ApgUser>, token: string): Promise<ApgUser> => {
  try {
    const { data } = await apgGraphQL(
      operationGetAccountUser,
      'UpdateUserAccount',
      {
        "id": userId,
        "_set": set
      },
      token
    )

    return data.updateUserByPk;
  } catch (error) {
    throw getError(error as RequestError)
  }
}

export const AccountEndpoints = {
  getUserAccount,
  updateUserAccount
}
