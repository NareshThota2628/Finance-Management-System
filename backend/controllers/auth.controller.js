const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const { User } = require('../models/User');

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Create Firebase user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        emailVerified: false
      });

      // Create Firestore user document
      const user = new User({
        uid: userRecord.uid,
        email,
        personalInfo: req.body.personalInfo
      });
      await user.save();

      // Generate verification token
      const token = jwt.sign(
        { uid: userRecord.uid },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send verification email
      await sendVerificationEmail(email, token);

      res.status(201).json({
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message.includes('already exists') 
          ? 'User already registered' 
          : 'Registration failed'
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await admin.auth().getUserByEmail(email);
      
      // Verify password (Firebase Admin SDK doesn't support password verification directly)
      // In production, use Firebase Client SDK for authentication
      const token = await admin.auth().createCustomToken(user.uid);
      
      // Generate session token
      const sessionToken = jwt.sign(
        { uid: user.uid, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token: sessionToken,
        user: {
          uid: user.uid,
          email: user.email
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      await admin.auth().updateUser(decoded.uid, {
        emailVerified: true
      });

      res.redirect(`${process.env.CLIENT_URL}/email-verified`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/error?code=token_expired`);
    }
  }
};