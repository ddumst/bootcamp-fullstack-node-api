import { ApgFile } from "@routes/users/interfaces/user.interface";
import { apgGraphQL } from "./apgApi"
import { operationFiles } from "./queries";
import { RequestError, getError } from "./account.endpoints";

const insertFile = async (file: ApgFile, token: string): Promise<ApgFile> => {
  const { data, errors } = await apgGraphQL(
    operationFiles,
    'InsertFile',
    {
      "object": file
    },
    token
  )

  if (errors) {
    throw getError(errors[0] as RequestError)
  }

  return data.insertFile;
}

export const FileEndpoints = {
  insertFile
}
