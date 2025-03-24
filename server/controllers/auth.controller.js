import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//User registration

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword
        });
    
        // Save user to database
        await newUser.save();
    
        // Generate JWT token
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
    
        // Set token in cookie
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
    
        // Return user info (without password)
        res.status(201).json({
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        });
      } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
      }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
    
        // Set token in cookie
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
    
        // Return user info
        res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
      }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const verifyToken = async (req, res) => {
    try {
        // The user is already attached to req by the protect middleware
        res.json({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt,
        });
      } catch (error) {
        console.error('Verify token error:', error);
        res.status(401).json({ message: 'Not authorized' });
      }
}

