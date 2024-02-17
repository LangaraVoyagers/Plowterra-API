import express, { 
  Request, 
  Response , 
  Application 
} from 'express';
import { 
  AddressInfo 
} from 'net';
import dotenv from 'dotenv'
import serverless from 'serverless-http';
import cors from 'cors';

// load environment variables
dotenv.config();

const app: Application = express();
app.use(cors());
const port = Number(process.env.PORT) || 8000;

app.get('/hello', (req: Request, res: Response) => {
  res.json({"message": "Hi from team Voyagers"});
});

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo
  console.log(`Server running on port ${port}`);
});

export const handler = serverless(app);
