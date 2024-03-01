import express, { Application, Request, Response } from "express";

import { AddressInfo } from "net";
import authUser from './middleware/authorization.middleware';
import bodyParser from "body-parser";
import connect from "./models/db";
import cors from 'cors';
import dotenv from "dotenv";
import router from "./routes";
import serverless from 'serverless-http';

// load environment variables
dotenv.config();

const port = Number(process.env.PORT) || 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// authorization middleware
// app.use(authUser);
app.use("/api/v1", router);

app.get('/hello', (req: Request, res: Response) => {
  res.json({"message": "Hi from team Voyagers"});
});

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo;
  console.log(`Server running on http://localhost:${port}`);
});

connect(process.env.MONGO_CONNECTION_STRING ?? "");

export const handler = serverless(app);
