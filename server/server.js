import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './models-postgres/dbPostgresConfig.js';
import router from './routes/router.js';
import validationError from './middlewares/error-middleware.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();




app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Подключение статических файлов
app.use('/public', express.static('public'));

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4225',
    credentials: true,
}));
app.use('/api', router);
app.use(validationError)

const start = async () => {
    try {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();

// Проверка соединения к базе данных
async function checkDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database Posgtresql has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


checkDatabaseConnection();