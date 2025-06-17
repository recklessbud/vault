// dependencies
import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import MethodOverride from 'method-override';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

//files
import { errorHandler } from './middlewares/errorHandler.middleware';
import homeRoutes from './routes/home.routes';
import authRouter from './routes/auth.routes';
// import userRouter from './routes/users.routes';
import vaultRoutes from './routes/vault.route'
import { morganMiddleware } from './middlewares/morganStream.middleware';
import { rateLimiter } from './middlewares/limiter.middleware';
import { corsOptions } from './config/cors.config';




//express middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');	
app.use(cookieParser());
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static('public'));
app.use(MethodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true 
    }
}))
app.use(helmet());

if(process.env.NODE_ENV === 'production') {
    app.use(morganMiddleware);
}else{
    app.use(morgan('dev'))

}

 

// routes
app.use('/', homeRoutes);
app.use('/auth', rateLimiter, authRouter);
app.use('/vaults', rateLimiter, vaultRoutes)
// app.use('/users', userRouter);

//use errorHandler middleware
app.use(errorHandler);

export default app;