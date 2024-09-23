import Admin from "../models/admin.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

dotenv.config();
const apiKey = process.env.SECRET_KEY;

// export const ReadAdmin = async (req, res) => {
//     try {
//         const admins = await Admin.find()
//         res.json(movies)
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }

export const RegisterAdmin = async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newAdmin = new Admin({
        username: req.body.username,
        password: hashedPassword
    })

    try {
        const userKey = req.headers['access'];
        if (userKey == apiKey) {
            const admin = await newAdmin.save();
            return res.status(201).json(admin)
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }


};

// Login a user
export const LoginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user in the database
        const user = await Admin.findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, apiKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const VerifyAdmin = async (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) return res.status(403).json({ error: 'No token provided' });
  
    jwt.verify(token.split(' ')[1], apiKey, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      res.json({ message: 'Token is valid', userId: decoded.userId });
    });
  };