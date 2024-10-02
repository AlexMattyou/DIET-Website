import express from "express";
import movieRoutes from "./routes/movie.route.js"
import adminRoutes from "./routes/admin.route.js"
import teamRoutes from "./routes/team.route.js"
import connectDB from "./lib/db.js"
import cors from 'cors';
import {robotsTxt,corsOptions,rateLimiter,helmet} from './lib/middleware.js';

const app = express();
const PORT = 5879;

app.use(cors({ origin: 'https://diettuty.onrender.com' }));

// MIDDLEVERSE
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// app.use(helmet());
app.use(rateLimiter);
// app.use(cors(corsOptions));

// Serve robots.txt
app.get('/robots.txt', robotsTxt);

// connectDB
connectDB();


app.get('/', (req, res) => {
    res.json({ msg: "Hello students!"});
});

app.use('/diet-admin', adminRoutes)
app.use('/movies', movieRoutes)
app.use('/team', teamRoutes)

app.listen(PORT, () => {
    console.log(`The Server is running...`);
});