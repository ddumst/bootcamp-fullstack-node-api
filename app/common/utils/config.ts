import * as dotenv from "dotenv";

dotenv.config();
let path;
let urlDB;
let urlAccountApp;

switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../../.env`;
    urlDB = 'mongodb://localhost:27017/gaming';
    break;
  case "development":
    path = `${__dirname}/../../.env`;
    urlDB = 'mongodb://localhost:27017/gaming';
    break;
  default:
    path = `${__dirname}/../../.env`;
    urlDB = 'mongodb://localhost:27017/gaming';
}
dotenv.config({ path: path });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const SERVER_PORT = process.env.SERVER_PORT;
export const URLDB = urlDB;