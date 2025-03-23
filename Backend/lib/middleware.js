import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';


// Disable crawling robots
const robotsTxt = (req, res) => {
  res.sendFile(path.join(path.resolve(), 'robots.txt'));
};

// CORS Options
const corsOptions = { 
  origin: 'https://diettut.org', 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200,
};

// Rate Limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 100 requests
});

export {
  robotsTxt,
  corsOptions,
  rateLimiter,
  helmet
};