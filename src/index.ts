import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3020;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('The server is running!');
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
