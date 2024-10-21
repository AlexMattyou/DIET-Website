import express from "express";
import movieRoutes from "./routes/movie.route.js"
import adminRoutes from "./routes/admin.route.js"
import teamRoutes from "./routes/team.route.js"
import driveRoutes from "./routes/drive.route.js"
import galleryRoutes from "./routes/gallery.route.js"
import updateRoutes from "./routes/update.route.js"
import eventRoutes from "./routes/activities.route.js"
import researchRoutes from "./routes/research.route.js"
import connectDB from "./lib/db.js"
import cors from 'cors';
import {robotsTxt,corsOptions,rateLimiter,helmet} from './lib/middleware.js';

const app = express();
const PORT = 5879;

// app.set('trust proxy', ['100.20.92.101', '44.225.181.72', '44.227.217.144']);

// app.use(cors({ origin: 'https://diettuty.onrender.com' }));
app.use(cors());

// MIDDLEVERSE
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// app.use(helmet());
// app.use(rateLimiter);
// app.use(cors(corsOptions));

// Serve robots.txt
app.get('/robots.txt', robotsTxt);

// connectDB
connectDB();

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
    res.json({ msg: "Hello students!"});
});

app.use('/diet-admin', adminRoutes)
app.use('/movies', movieRoutes)
app.use('/team', teamRoutes)
app.use('/drive', driveRoutes)
app.use('/gallery', galleryRoutes)
app.use('/latest-updates', updateRoutes)
app.use('/activity', eventRoutes)
app.use('/research', researchRoutes)

app.listen(PORT, () => {
    console.log(`The Server is running...`);
});