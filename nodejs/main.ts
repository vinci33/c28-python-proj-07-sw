import express from 'express';
// import expressSession from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { routes } from './routes';
import { Knex } from 'knex'
dotenv.config();
const config = require('./knexfile');
export const knex = require('knex')(config[process.env.NODE_ENV || 'development']);




const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//     expressSession({
//         secret: "kennethAndJasonWithJames",
//         resave: true,
//         saveUninitialized: true,
//     })
// );


// declare module 'express-session' {
//     export interface SessionData {
//         userId?: number;
//         customer_id?: number;
//     }
// }



app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', "html")))

app.use
const PORT = process.env.NODE_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

