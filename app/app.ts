import express from "express";
import mongoose from 'mongoose';
import moduleAlias from 'module-alias';
import * as http from "http";
import * as bodyparser from "body-parser";

moduleAlias.addAliases({
  "@common": `${__dirname}/common`,
  "@extensions": `${__dirname}/extensions`,
  "@routes": `${__dirname}/routes`,
});

import { CommonRoutesConfig } from "@common/common.routes.config";
import { WildRiftRoutes } from "@routes/wildrift/wildrift.routes.config";

import * as expressWinston from "express-winston";
import { PORT, SERVER_PORT, URLDB, NODE_ENV } from "@common/utils/config";

const app = express();
const server: http.Server = new http.Server(app);
const routes: any = [];

const options = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  process.exit(1);
});

app.use(bodyparser.json({ limit: "5mb" }));

let index = expressWinston.requestWhitelist.indexOf("headers");
if (index !== -1) expressWinston.requestWhitelist.splice(index, 1);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("Access-Control-Request-Headers")
  );
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  } else {
    return next();
  }
});

// routes definition should be placed here
routes.push(new WildRiftRoutes(app));

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server running at port 6030`);
});

mongoose
  .connect('mongodb://mongo:27017/gaming', options)
  .then(() => {
    app.listen(6030, () => {
      console.log(`Api listening on port 6030!`);
    });
    
    server.listen(6040, () => {
      console.log("PM2 Restarted");
      console.log(`Environment: '${NODE_ENV}'`);
      console.log(`Server running at port 6040`);
      routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
      });
      console.log("MongoDB is connected");
    });
  })
  .catch((err) => {
    console.log(err)
    console.log(
      "MongoDB connection unsuccessful, retry after 5 seconds. ",
    );
  });


export default app;