import Admin from "../models/admin.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';


dotenv.config();
const apiKey = process.env.SECRET_KEY;

export const ResetRequest = async (req, res) => {
    const email = req.body.email;
    
    // Find user by email
    const user = await Admin.findOne({ email });
    if (!user) {
        console.log("not found")
        return res.status(404).json({ message: 'Email not found' });
    }

    // Generate reset token and expiration time
    const resetToken = uuidv4();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Update user with reset token and expiration time
    user.resetToken = resetToken;
    user.tokenExpiry = expirationTime;
    await user.save();

    // Create reset link for email
    const resetLink = `https://diettut.org/admin-zone/reset/?c=${resetToken}`;

    // Send the reset email
    try {
        await ResetEmail(user.username, user.email, resetLink);
        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
};

export const ResetPassword = async (req, res) => {
    console.log("running")
    const token = req.body.token;
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await Admin.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

    if (!user){
        console.log("oh no user")
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    

    // Hash new password and save
    user.password = hashedPassword;
    user.email = email;
    user.username = username;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
};

export const VerifyResetToken = async (req, res) => {
    const token = req.body.token;
    const user = await Admin.findOne({ resetToken: token });

    if (!user) {
        console.log("no user")
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    if (user.tokenExpiry < Date.now()){
        console.log("timeout")
        return res.status(400).json({ message: 'Timeout' });
    }

    res.json({ message: 'Token is valid', user: user});
};


const ResetEmail = async (username, userEmail, reset_link) => {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,  // Your email
            pass: process.env.EMAIL_PASSWORD   // Your email password or app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: userEmail,
        subject: 'Password Reset Request',
        html: `
        <link rel="stylesheet" href="https://diettut.org/bootstrap/css/bootstrap.min.light.css">
<div class="container mt-5">
  <img src="https://diettut.org/data/banner.jpg" alt="DIET Website Banner" class="img-fluid">
  <div class="card mt-4">
    <div class="card-body">
      <p class="card-text">Dear ${username},</p>
      <p class="card-text">
        We received a <strong>request to reset your password</strong> for
        <strong>Admin login in DIET website</strong>.
        If you did not make this request, please ignore this email.
      </p>
      <p class="card-text">To reset your password, please click the link below:</p>
      <p><a href="${reset_link}" target="_blank" rel="noopener" class="btn btn-primary">RESET PASSWORD</a></p>
      <p class="card-text">If the button doesn't work, you can copy and paste the link into your web browser:<a href="${reset_link}" target="_blank" rel="noopener" class="link"><br>${reset_link} </a> </p>
      <p class="card-text">
        Please note that this link is only <strong>valid for 15 minutes</strong>. If you haven't reset your password within this time, you'll need to submit another request.
      </p>
      <p class="card-text">Thank you,<br>DIET website<br><br></p>
    </div>
  </div>
</div>

        `
    };

    // Send the email
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// sendPasswordResetEmail("alexmattnsn@gmail.com", "https://google.com");


export const RegisterAdmin = async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newAdmin = new Admin({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
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
        if (!user) {
            console.log("Invalid username")
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password")
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


  export const sendFeedback = async (req, res) => {
    const { userName, userEmail, userPhone, userMessage } = req.body;

    // Configure the transporter
    const transporter2 = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,  
            pass: process.env.EMAIL_PASSWORD   
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: 'New Message from DIET Website',
        html: `
        <link rel="stylesheet" href="https://diettut.org/bootstrap/css/bootstrap.min.light.css">
        <div class="container mt-5">
            <img src="https://diettut.org/data/banner.jpg" alt="DIET Website Banner" class="img-fluid">
            <div class="card shadow-lg border-0 rounded-4">
                <div class="card-body p-4">
                    <h4 class="mb-4">Hello,</h4>
                    <p>You received a new message from your website:</p>
                    
                    <div class="bg-light p-3 rounded-3 mb-3">
                        <p><strong>Name:</strong> ${userName}</p>
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <p><strong>Mobile:</strong> ${userPhone}</p>
                    </div>

                    <div class="bg-light p-3 rounded-3">
                        <p><strong>Message:</strong></p>
                        <p>${userMessage}</p>
                    </div>

                    <hr class="my-4">
                    <p class="text-muted">Best regards,<br>This email was sent from your website</p>
                </div>
            </div>
        </div>
        `
    };

    // Send the email
    try {
        const response = await transporter2.sendMail(mailOptions);
        console.log('Feedback email sent:', response);
        // Sending structured JSON response
        res.json({ message: 'Success!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email' });
    }
};
