import express from "express";
import movieRoutes from "./routes/movie.route.js"
import adminRoutes from "./routes/admin.route.js"
import connectDB from "./lib/db.js"
import {robotsTxt,corsOptions,rateLimiter,helmet,cors} from './lib/middleware.js';

const app = express();
const PORT = 5879;

app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Replace with the origin where your frontend is hosted
    credentials: true
  }));

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

app.listen(PORT, () => {
    console.log(`The Server is running...`);
});