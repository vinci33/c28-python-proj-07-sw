import express from 'express';
import dotenv from 'dotenv';

dotenv.config();



// import { routes } from './routes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// app.use('/', routes);

const PORT = process.env.NODE_PORT || 8080;

app.use(express.static('public'))


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

