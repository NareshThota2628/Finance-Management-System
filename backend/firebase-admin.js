const admin = require('firebase-admin');
const logger = require('./utils/logger');

const initializeFirebase = () => {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    logger.info('Firebase Admin initialized successfully.');
  } catch (error) {
    logger.error(`Firebase Initialization Error: ${error.message}`);
    process.exit(1); // Exit if Firebase fails to initialize
  }
};

module.exports = { initializeFirebase };