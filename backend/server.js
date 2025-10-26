import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/resume.js';

dotenv.config();

const app = express()
<<<<<<< HEAD
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
    credentials: true
}))
=======

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
>>>>>>> f06e3b17011432f7ce15dcb9933988d991f64ae4
app.use(express.json())

app.use('/api/resume', routes)

<<<<<<< HEAD
const PORT = process.env.PORT || 5000;
=======
const PORT = process.env.PORT || 4000;
>>>>>>> f06e3b17011432f7ce15dcb9933988d991f64ae4
app.listen(PORT, () => (console.log(`Server is running on port ${PORT}`)
));