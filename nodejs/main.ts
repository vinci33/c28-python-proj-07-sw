import express from 'express';
import { OpenaiController } from './TsControllers/OpenaiController';
import dotenv from 'dotenv';

dotenv.config();



// import { routes } from './routes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const openaiController = new OpenaiController()

// app.use('/', routes);

const PORT = process.env.NODE_PORT || 8080;

app.use(express.static('public'))


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
