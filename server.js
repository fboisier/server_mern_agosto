// Importamos el módulo express
import express from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { conectarDB } from './config/mongoose.config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routerAuth from './src/routes/auth.routes.js';

config();

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({ credentials: true, origins: ['http://localhost:5173', 'https://client-mern-agosto.vercel.app/']
}));

const port = process.env.PORT || 8000;

app.use('/api/auth', routerAuth);

app.use("/healthz", (req, res) => {
    res.status(200).send("ok");
});

conectarDB();

app.listen(port, () => {
    console.log(`El servidor está activo en el puerto: ${port}`);
});