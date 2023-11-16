import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { routes } from './routes';

dotenv.config();





const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/', routes);

const PORT = process.env.NODE_PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', "html")))
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

