// Firebase configuration for client-side
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlHolfcs-5KGCjpW7Xl4SyoaNH2tqdGUs",
  authDomain: "stock-trade-generator.firebaseapp.com",
  projectId: "stock-trade-generator",
  storageBucket: "stock-trade-generator.firebasestorage.app",
  messagingSenderId: "595408003505",
  appId: "1:595408003505:web:72432afb97445da9745d90",
  measurementId: "G-3P6T7EMNV3"
};

// Initialize Firebase
let app, auth, db, analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  alert('Firebase configuration error. Please check the setup.');
}

// Export for use in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseApp = app;

// Auth functions
window.signUp = async (email, password) => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized. Please check your Firebase configuration.');
    }

    console.log('Attempting to create user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Signup error:', error);

    // Provide more specific error messages
    let errorMessage = error.message;
    if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Firebase Authentication is not properly configured. Please enable Email/Password authentication in Firebase Console.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    }

    return { success: false, error: errorMessage };
  }
};

window.signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

window.signOutUser = async () => {
  try {
    if (!auth) {
      console.log('Firebase Auth not initialized');
      return { success: true }; // Treat as success since user is already "signed out"
    }

    // Check if user is actually signed in
    if (!auth.currentUser) {
      console.log('No user is currently signed in');
      return { success: true }; // Already signed out
    }

    console.log('Signing out user:', auth.currentUser.email);
    await signOut(auth);
    console.log('User signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Save stock results to Firestore
window.saveStockResults = async (userId, resultsData) => {
  try {
    const docRef = await addDoc(collection(db, 'stockResults'), {
      userId: userId,
      ...resultsData,
      createdAt: new Date(),
      timestamp: Date.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user's saved results
window.getUserResults = async (userId) => {
  try {
    console.log('Loading results for user:', userId);
    const q = query(
      collection(db, 'stockResults'),
      where('userId', '==', userId)
      // Temporarily removed orderBy to avoid index requirement
      // orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    // Sort results client-side by createdAt (newest first)
    results.sort((a, b) => {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt || 0);
      return dateB - dateA; // Descending order (newest first)
    });

    console.log('Loaded', results.length, 'results');
    return { success: true, results };
  } catch (error) {
    console.error('Error loading results:', error);
    return { success: false, error: error.message };
  }
};

// Delete a saved result from Firestore
window.deleteStockResult = async (resultId) => {
  try {
    console.log('Deleting result with ID:', resultId);
    const docRef = doc(db, 'stockResults', resultId);
    await deleteDoc(docRef);
    console.log('Result deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting result:', error);
    return { success: false, error: error.message };
  }
};

// Auth state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    localStorage.setItem('currentUser', JSON.stringify({
      uid: user.uid,
      email: user.email
    }));
    
    // Show/hide elements based on auth state
    const authElements = document.querySelectorAll('.auth-required');
    const noAuthElements = document.querySelectorAll('.no-auth-required');
    
    authElements.forEach(el => el.style.display = 'block');
    noAuthElements.forEach(el => el.style.display = 'none');
    
  } else {
    // User is signed out
    localStorage.removeItem('currentUser');
    
    // Show/hide elements based on auth state
    const authElements = document.querySelectorAll('.auth-required');
    const noAuthElements = document.querySelectorAll('.no-auth-required');
    
    authElements.forEach(el => el.style.display = 'none');
    noAuthElements.forEach(el => el.style.display = 'block');
  }
});
