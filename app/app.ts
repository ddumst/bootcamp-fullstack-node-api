import express from "express";
import moduleAlias from 'module-alias';
import cors from 'cors'; 
import * as http from "http";
import * as bodyparser from "body-parser";
import * as WebSocket from 'ws';
import fileUpload from 'express-fileupload';

moduleAlias.addAliases({
  "@common": `${__dirname}/common`,
  "@auth": `${__dirname}/auth`,
  "@extensions": `${__dirname}/extensions`,
  "@routes": `${__dirname}/routes`,
  "@graph": `${__dirname}/graph`,
});

import { CommonRoutesConfig } from "@common/common.routes.config";
import { UsersRoutes } from "@routes/users/users.routes.config";

import * as expressWinston from "express-winston";
import * as websocket from "@common/utils/websocket";
import { PORT, NODE_ENV } from "@common/utils/config";

const app = express();
const server: http.Server = new http.Server(app);

const port = PORT;
const routes: any = [];

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  process.exit(1);
});

app.use(bodyparser.json({ limit: "5mb" }));

app.use(cors({
  origin: `${process.env.DOMAIN_URL}`, // Especifica el origen permitido
	credentials: true,
  exposedHeaders: ['apgstats_auth_token']
}));

// Middleware to handle incoming files
app.use(fileUpload({
  createParentPath: true
}))

let index = expressWinston.requestWhitelist.indexOf("headers");
if (index !== -1) expressWinston.requestWhitelist.splice(index, 1);

// routes definition should be placed here
routes.push(new UsersRoutes(app));

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server running at port ${port}`);
});

const wss = websocket.init(server);

wss.on('connection', (ws: WebSocket) => {
  websocket.handleConnection(ws);   
  websocket.getClient().send(JSON.stringify({
    action: 'start'
  }));
});

app.listen(port, () => {
  console.log(`Api listening on port ${port}!`);
});

server.listen(3030, () => {
  console.log("PM2 Restarted");
  console.log(`Environment: '${NODE_ENV}'`);
  console.log(`Server running at port 3030`);
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`Routes configured for ${route.getName()}`);
  });
});


export default app;
