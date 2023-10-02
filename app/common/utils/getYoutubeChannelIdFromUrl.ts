import { RequestError } from "@graph/account.endpoints";
import axios from "axios";
import cheerio from "cheerio";

const getYoutubeChannelIdFromUrl = async (channelLink: string): Promise<string | RequestError> => {
  try {
    const response = await axios.get(channelLink);
    const html = response.data;
    
    const $ = cheerio.load(html);
    const canonicalLink = $('link[rel="canonical"]').attr('href');
    
    if (canonicalLink) {
      const match = canonicalLink.match(/channel\/([A-Za-z0-9_-]+)/i);
      if (match) {
        const channelId = match[1];
        return channelId;
      }
    }
    
    return '';
  } catch (error: unknown) {
    return {
      title: 'Error',
      message: 'Error fetching channel ID from URL',
      response: {
        status: 400
      },
      code: 3052
    }
  }
};

export default getYoutubeChannelIdFromUrl;