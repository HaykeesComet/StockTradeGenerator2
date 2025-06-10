const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { calculateInvestments, calculateShares, calculatePercentages, calculateTotalInvestment, calculateAmountShares } = require('./public/stockTradeGenerator');

// Try to load Firebase with error handling
let db = null;
let verifyToken = null;
let requireAuth = null;

// Check if service account key exists before trying to load Firebase
const fs = require('fs');
const serviceAccountPath = './serviceAccountKey.json';

if (fs.existsSync(serviceAccountPath)) {
  try {
    const firebase = require('./config/firebase');
    db = firebase.db;
    console.log('✅ Firebase loaded successfully');
  } catch (error) {
    console.error('❌ Firebase loading failed:', error.message);
    console.log('📝 App will run without Firebase features');
  }

  try {
    const auth = require('./middleware/auth');
    verifyToken = auth.verifyToken;
    requireAuth = auth.requireAuth;
    console.log('✅ Auth middleware loaded successfully');
  } catch (error) {
    console.error('❌ Auth middleware loading failed:', error.message);
    // Create dummy middleware that always fails
    verifyToken = (req, res, next) => {
      res.status(500).json({ success: false, error: 'Firebase not configured' });
    };
    requireAuth = (req, res, next) => next();
  }
} else {
  console.log('📝 Service account key not found. Running without server-side Firebase.');
  console.log('📝 To enable Firebase features:');
  console.log('   1. Download serviceAccountKey.json from Firebase Console');
  console.log('   2. Place it in the project root directory');
  console.log('   3. Restart the server');

  // Create dummy middleware that returns helpful error messages
  verifyToken = (req, res, next) => {
    res.status(500).json({
      success: false,
      error: 'Server-side Firebase not configured. Please add serviceAccountKey.json to enable saving results.',
      instructions: [
        '1. Go to Firebase Console > Project Settings > Service Accounts',
        '2. Click "Generate new private key"',
        '3. Save as serviceAccountKey.json in project root',
        '4. Restart server'
      ]
    });
  };
  requireAuth = (req, res, next) => next();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

// Authentication routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/saved-results', (req, res) => {
  res.render('saved-results');
});

// Simple server status check
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    firebase: !!db,
    port: port
  });
});

// Test Firebase connection
app.get('/api/test-firebase', (req, res) => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Database available:', !!db);

    if (!db) {
      return res.json({
        success: false,
        error: 'Firestore database not initialized',
        details: 'Check your Firebase configuration and service account key',
        suggestions: [
          '1. Download serviceAccountKey.json from Firebase Console',
          '2. Place it in project root directory',
          '3. Create .env file with GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json',
          '4. Restart the server'
        ]
      });
    }

    res.json({
      success: true,
      message: 'Firebase connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Firebase initialization failed'
    });
  }
});

app.get('/app', (req, res) => {
  res.render('app');
});

// API route to save results to Firebase
app.post('/api/save-results', verifyToken, async (req, res) => {
  console.log('🔥 === SAVE RESULTS API CALLED ===');
  console.log('🔥 Timestamp:', new Date().toISOString());
  console.log('🔥 User object:', req.user);
  console.log('🔥 Request headers:', req.headers);
  console.log('🔥 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🔥 Database available:', !!db);

  try {
    if (!req.user || !req.user.uid) {
      console.error('❌ No user found in request');
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const userId = req.user.uid;
    const resultsData = req.body;

    console.log('🔥 User ID:', userId);
    console.log('🔥 Results data keys:', Object.keys(resultsData));

    // Validate required data
    if (!resultsData.name || !resultsData.capital || !resultsData.stockPrices) {
      console.error('❌ Missing required data');
      console.error('❌ Has name:', !!resultsData.name);
      console.error('❌ Has capital:', !!resultsData.capital);
      console.error('❌ Has stockPrices:', !!resultsData.stockPrices);

      return res.status(400).json({
        success: false,
        error: 'Missing required data: name, capital, or stockPrices'
      });
    }

    // Check if Firebase is properly initialized
    if (!db) {
      console.error('❌ Firestore database not initialized');
      return res.status(500).json({
        success: false,
        error: 'Database not available. Please check Firebase configuration.'
      });
    }

    // Add the result to Firestore
    console.log('🔥 Adding document to Firestore...');
    console.log('🔥 Document data:', {
      userId: userId,
      name: resultsData.name,
      capital: resultsData.capital,
      stockCount: resultsData.stockPrices.length
    });

    const docRef = await db.collection('stockResults').add({
      userId: userId,
      ...resultsData,
      createdAt: new Date(),
      timestamp: Date.now()
    });

    console.log('✅ Document saved with ID:', docRef.id);
    res.json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('❌ === ERROR SAVING RESULTS ===');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error stack:', error.stack);

    // Provide more specific error messages
    let errorMessage = error.message;
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please check Firestore security rules.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Database temporarily unavailable. Please try again.';
    } else if (error.message.includes('serviceAccountKey')) {
      errorMessage = 'Firebase service account not configured properly.';
    }

    res.status(500).json({ success: false, error: errorMessage });
  }
});

// API route to get user's saved results
app.get('/api/results', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db.collection('stockResults')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/submit', (req, res) => {
  const { name, capital, stockCount } = req.body;
  const numStocks = parseInt(stockCount);

  // Build stockPrices array dynamically
  const stockPrices = [];
  for (let i = 1; i <= numStocks; i++) {
    const companyName = req.body[`stockCompany${i}`];
    const stockPrice = req.body[`stock${i}Price`];

    if (companyName && stockPrice) {
      stockPrices.push({
        name: companyName,
        price: parseFloat(stockPrice)
      });
    }
  }

  const investments = calculateInvestments(parseFloat(capital), stockPrices);
  const shares = calculateShares(investments, stockPrices);
  const totalShares = shares.map(s => s.shares);
  const averageShares = totalShares.reduce((sum, num) => sum + num, 0) / totalShares.length;
  const percentages = calculatePercentages(investments, parseFloat(capital));
  const totalInvestment = calculateTotalInvestment(investments);
  const amountShares = calculateAmountShares(shares, stockPrices);

  res.render('result', {
    name,
    capital: parseFloat(capital),
    stockPrices,
    investments,
    shares,
    percentages,
    shareBuyAverage: averageShares,
    totalInvestmentAmount: totalInvestment,
    totalAmountShares: amountShares
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
