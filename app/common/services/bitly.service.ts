import { BitlyShorten } from "@common/interfaces/utils.interface";
import { BITLY_ACCESS_TOKEN, BITLY_GROUP_GUID } from "@common/utils/config";
import axios from 'axios';

export const generateShortenUrl = async(url: string): Promise<BitlyShorten> => {
  try {
    const json = JSON.stringify({
      group_guid: BITLY_GROUP_GUID,
      domain: "bit.ly",
      long_url: url
    });

    const { data } = await axios.post('https://api-ssl.bitly.com/v4/shorten', json, {
      headers: {
        Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    return error.response;
  }
};