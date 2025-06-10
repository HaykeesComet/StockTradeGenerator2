# Firebase Setup Instructions

## Prerequisites

You need to set up Firebase Authentication and Firestore for this application to work properly.

## 🚨 TROUBLESHOOTING: Firestore Security Rules

If you're getting 400 Bad Request errors when saving, you need to update Firestore security rules:

### Firestore Security Rules Fix:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `stock-trade-generator`
3. **Go to Firestore Database** → **Rules** tab
4. **Replace the rules with**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own stock results
    match /stockResults/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. **Click "Publish"**

## 🚨 TROUBLESHOOTING: auth/configuration-not-found Error

If you're getting the error "Firebase: Error (auth/configuration-not-found)", follow these steps:

### Quick Fix Steps:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `stock-trade-generator`
3. **Enable Authentication**:
   - Click "Authentication" in left sidebar
   - If you see "Get started", click it
   - Go to "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### Test Your Setup:

- Navigate to `http://localhost:3000/firebase-test.html` to test your Firebase connection

## Steps:

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `stock-trade-generator`
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Enable Firestore:
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred location

### 2. Service Account Setup

1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in the root directory of this project
6. Add `serviceAccountKey.json` to your `.gitignore` file

### 3. Environment Setup

Create a `.env` file in the root directory with:

```
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

### 4. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own stock results
    match /stockResults/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Firebase Authentication Settings

1. Go to Authentication > Settings
2. Add your domain to authorized domains if deploying
3. Configure email templates if needed

## Testing

1. Run `npm start`
2. Navigate to `http://localhost:3000`
3. Try signing up with a test email
4. Create a stock analysis and save it
5. Check if the data appears in Firestore console

## Troubleshooting

- Make sure your service account key is properly placed
- Check that Firestore rules allow your operations
- Verify that Authentication is enabled for Email/Password
- Check browser console for any JavaScript errors
