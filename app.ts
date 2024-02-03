import express, { 
  Request, 
  Response , 
  Application 
} from 'express';
import { 
  AddressInfo 
} from 'net';
import dotenv from 'dotenv'

// load environment variables
dotenv.config();

const app: Application = express();
const port = Number(process.env.PORT) || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hi we are team Voyagers');
});

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo
  console.log(`Server running on port ${port}`);
});
