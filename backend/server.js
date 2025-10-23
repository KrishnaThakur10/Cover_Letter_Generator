import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/resume.js';

dotenv.config();

const app = express()

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/resume', routes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => (console.log(`Server is running on port ${PORT}`)
));