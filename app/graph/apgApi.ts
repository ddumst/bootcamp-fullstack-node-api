import axios from "axios";

export const apgGraphQL = async (
  operationsDoc: string,
  operationName: string,
  variables?: Record<string, any>,
  token?: string
) => {
  const config = {
    url: 'https://apidev.apg.gg/v1/graphql',
    method: 'post',
    data: {
      query: operationsDoc,
      variables,
      operationName,
    },
    headers: token ? { Authorization: 'Bearer ' + token } : {}
  };

  return axios(config)
    .then(result => result.data);
};
