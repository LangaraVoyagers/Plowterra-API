import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { AddressInfo } from "net";
import connect from "./models/db";
import router from "./routes";

// load environment variables
dotenv.config();

const app: Application = express();
const port = Number(process.env.PORT) || 8000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi we are team Voyagers");
});

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo;
  console.log(`Server runnign on http://localhost:${port}`);
});

connect(process.env.CONNECTION_STRING ?? "");
