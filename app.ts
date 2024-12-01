import express, { Application, Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { AddressInfo } from "net";
import serverless from "serverless-http";
import connect from "./models/db";
import router from "./routes";

// load environment variables
dotenv.config();

const port = Number(process.env.PORT) || 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hi from team Voyagers" });
});

// authorization middleware
// app.use(authUser);
app.use("/api/v1", router);

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo;
  console.log(`Server running on http://localhost:${port}`);
});

connect(process.env.MONGO_CONNECTION_STRING ?? "");

export const handler = serverless(app);
