import * as dotenv from "dotenv";

dotenv.config();
let path;
let urlDB;
let urlAccountApp;

switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../../.env.production`;
    urlDB = 'mongodb://78.47.220.243:27017/apg';
    urlAccountApp = "https://account.apg.gg"
    break;
  case "development":
    path = `${__dirname}/../../.env.development`;
    urlDB = 'mongodb://78.47.220.243:27018/apg';
    urlAccountApp = "https://account.apg.gg"
    break;
  default:
    path = `${__dirname}/../../.env.production`;
    urlDB = 'mongodb://78.47.220.243:27017/apg';
    urlAccountApp = "http://localhost:4200"
}
dotenv.config({ path: path });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const SERVER_PORT = process.env.SERVER_PORT;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;
export const BITLY_GROUP_GUID = process.env.BITLY_GROUP_GUID;
export const TWITTER_TOKEN = process.env.TWITTER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAO81HQEAAAAANO7aMqO6VJxSUN0iFXyU7AHnkpA%3DlwoiwMvxCMeJ7O0NnK0ZK0SjVANeGyQTcElFFpmVLWOCOaVyBh';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
export const TWITCH_SECRET = process.env.TWITCH_SECRET;
export const YOUTUBE_KEY = process.env.YOUTUBE_KEY;
// process.env.CLASH_ROYALE_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljNGU1YzIwLWJmOWYtNGIzZi1iMjMxLWY5OTM0MmI2YWJkNSIsImlhdCI6MTU4NTIzOTI5NCwic3ViIjoiZGV2ZWxvcGVyLzNhOWUxNTZlLWRmMGYtNmNhMS0xNjdiLTYwYjEzMTA3N2M1MSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMDEuMjQwLjE0Ny4xNzAiXSwidHlwZSI6ImNsaWVudCJ9XX0.FGU415_gpfdBrFUmyCUSPLBag5pgPQ_o_o4SIK3KiWlNErHuPwwWis7TTeROK8K_g7P-QLBCnUXaq5b2qEjP8A';
export const EXPIRES_TOKEN = '15d';
export const SEED = process.env.SEED;
export const URLDB = urlDB;
export const URL_ACCOUNT_APP = urlAccountApp;
export const URL_WEB = process.env.URL_WEB;
export const URL_PRERENDER = process.env.URL_PRERENDER;
export const TOKEN_PRERENDER = process.env.TOKEN_PRERENDER;
export const URL_ADMIN = process.env.URL_ADMIN;
export const URL_ORGANIZER = process.env.URL_ORGANIZER;
export const NOTIFY_ICON = 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1576892518007.png?alt=media&token=Ke5lo3CFQ04pSJyX';