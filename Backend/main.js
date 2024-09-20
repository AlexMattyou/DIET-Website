import express from "express";
import movieRoutes from "./routes/movie.route.js"
import connectDB from "./lib/db.js"
import cors from "cors";

const corsOptions = { 
	origin: 'https://diettuty.onrender.com', 
	methods: 'GET,POST,PUT,DELETE', 
	allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200
};


const app = express();
const PORT = 6969;

// only allow the website
app.use(cors(corsOptions));

// MIDDLEVERSE
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// connectDB
connectDB();

app.get('/', (req, res) => {
    res.json({ msg: "Hello students!"});
});

app.use('/movies', movieRoutes)

app.listen(PORT, () => {
    console.log(`The Server is running at http://127.0.0.1:6969`);
});