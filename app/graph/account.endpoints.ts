import { ApgUser } from "@routes/users/interfaces/user.interface";
import { apgGraphQL } from "./apgApi"
import { operationGetAccountUser } from "./queries";

export interface RequestError {
  response: {
    status: number;
  },
  title: string,
  message: string,
  code?: number
}

export const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const getUserAccount = async (userId: number): Promise<ApgUser> => {
  try {
    const { data } = await apgGraphQL(
      operationGetAccountUser,
      'GetUserAccount',
      {
        "id": userId
      }
    )

    return data.user;
  } catch (error) {
    throw getError(error as RequestError)
  }
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
