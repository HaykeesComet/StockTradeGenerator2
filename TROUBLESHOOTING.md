# 🔧 Troubleshooting Guide

## Error: "HTTP error! status: 500" when saving results

This error indicates a server-side issue. Follow these steps to diagnose and fix:

### Step 1: Check Firebase Configuration

1. **Test Firebase Connection**:
   - Start your server: `npm start`
   - Navigate to: `http://localhost:3000/api/test-firebase`
   - This will tell you if Firebase is properly configured

### Step 2: Check Server Console

When you try to save results, check your server console for detailed error messages. Look for:

```
=== SAVE RESULTS API CALLED ===
User: [user-id]
Request body: [data]
```

### Step 3: Common Issues and Solutions

#### Issue 1: Firebase Not Initialized
**Error**: "Firestore database not initialized"
**Solution**: 
1. Make sure you have a `serviceAccountKey.json` file in your project root
2. Create a `.env` file with: `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`
3. Download the service account key from Firebase Console

#### Issue 2: Authentication Issues
**Error**: "No token provided" or "Invalid token"
**Solution**:
1. Make sure you're logged in before trying to save
2. Check browser console for authentication errors
3. Try logging out and logging back in

#### Issue 3: Firestore Not Enabled
**Error**: Permission denied or unavailable
**Solution**:
1. Go to Firebase Console
2. Enable Firestore Database
3. Set up security rules (see FIREBASE_SETUP.md)

#### Issue 4: Missing Service Account
**Error**: "serviceAccountKey.json not found"
**Solution**:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccountKey.json` in project root
4. Add to `.gitignore`

### Step 4: Debug Steps

1. **Check if you're logged in**:
   - Open browser console
   - Type: `localStorage.getItem('currentUser')`
   - Should show user data if logged in

2. **Test Firebase directly**:
   - Navigate to: `http://localhost:3000/firebase-test.html`
   - Click "Test Firebase Connection"

3. **Check server logs**:
   - Look for detailed error messages in your terminal
   - Check for Firebase initialization errors

### Step 5: Quick Fix Checklist

- [ ] Firebase Authentication enabled in console
- [ ] Email/Password provider enabled
- [ ] Firestore Database created
- [ ] Service account key downloaded and placed correctly
- [ ] `.env` file created with correct path
- [ ] User is logged in before trying to save
- [ ] No console errors in browser

### Need More Help?

If you're still having issues:
1. Check the server console output when the error occurs
2. Check browser console for any JavaScript errors
3. Verify your Firebase project settings
4. Make sure all dependencies are installed: `npm install`
