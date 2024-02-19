import express, { Request, Response, Application } from 'express';
import { AddressInfo } from 'net';
import dotenv from 'dotenv';
import productRouter from './routes/products.routes'; 

dotenv.config();

require('./models/db');

const app: Application = express();
app.use(express.json());
const port = Number(process.env.PORT) || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hi we are team Voyagers');
});

app.use('/api/v1', productRouter);

const listener = app.listen(port, () => {
  const { port } = listener.address() as AddressInfo;
  console.log(`Server running on port ${port}`);
});
