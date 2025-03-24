import express from "express";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

//routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js'
import locationRoutes from './routes/location.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json()); // pars req bodys to json
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/location', locationRoutes);


app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Explorer API"
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
