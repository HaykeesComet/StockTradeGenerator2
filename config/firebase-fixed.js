// Firebase configuration for server-side (Node.js)
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    console.log('🔥 Initializing Firebase...');
    
    // Try to load service account key
    const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
    console.log('🔥 Looking for service account at:', serviceAccountPath);
    
    let serviceAccount;
    try {
      serviceAccount = require(serviceAccountPath);
      console.log('✅ Service account key loaded successfully');
      console.log('✅ Project ID:', serviceAccount.project_id);
    } catch (error) {
      console.error('❌ Could not load serviceAccountKey.json:', error.message);
      console.log('📝 Please download serviceAccountKey.json from Firebase Console');
      console.log('📝 Place it in the project root directory');
      throw new Error('Service account key not found');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || "stock-trade-generator"
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('📝 To fix this:');
    console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
    console.log('2. Click "Generate new private key"');
    console.log('3. Save the file as "serviceAccountKey.json" in your project root');
    console.log('4. Restart the server');
    throw error;
  }
}

let db, auth;
try {
  db = admin.firestore();
  auth = admin.auth();
  console.log('✅ Firestore and Auth services initialized');
} catch (error) {
  console.error('❌ Error initializing Firestore/Auth:', error.message);
  throw error;
}

module.exports = { admin, db, auth };
