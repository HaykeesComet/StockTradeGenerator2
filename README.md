# 💵 Stock Trade Generator

A web application that helps users generate stock trade recommendations and manage their investment portfolios with Firebase authentication and data persistence.

## Features

### Core Functionality
- **Dynamic Stock Analysis**: Add unlimited stock entries (starts with 5 by default)
- **Investment Calculations**: Automatically calculates investment amounts, shares, and percentages
- **Multiple Broker Support**: Provides recommendations for Robinhood and E*TRADE
- **Print & Export**: Print results or save as image

### User Management
- **User Authentication**: Sign up and login with email/password
- **Guest Mode**: Use the app without creating an account
- **Saved Results**: Authenticated users can save and retrieve their analyses
- **Personal Dashboard**: View all saved stock analyses

### Technical Features
- **Firebase Integration**: Authentication and Firestore database
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic form management with add/remove stock functionality

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StockTradeGenerator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the instructions in `FIREBASE_SETUP.md`
   - Download your service account key and place it as `serviceAccountKey.json`
   - Create a `.env` file based on `.env.example`

4. **Run the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### For Guest Users
1. Visit the homepage
2. Click "Continue as Guest" or go directly to the app
3. Enter your name and initial capital
4. Add stock companies and their current prices
5. Submit to get investment recommendations
6. Print or save results as image

### For Registered Users
1. Sign up for an account or login
2. Use all guest features plus:
   - Save your analyses to the cloud
   - View your saved results anytime
   - Access your data from any device

## Project Structure

```
StockTradeGenerator/
├── config/
│   └── firebase.js          # Firebase server configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── public/
│   ├── firebase-config.js   # Client-side Firebase config
│   ├── stockTradeGenerator.js # Core calculation logic
│   └── *.css               # Stylesheets
├── views/
│   ├── index.ejs           # Homepage
│   ├── login.ejs           # Login page
│   ├── signup.ejs          # Registration page
│   ├── app.ejs             # Main application
│   ├── result.ejs          # Results display
│   └── saved-results.ejs   # Saved results dashboard
├── app.js                  # Main server file
└── package.json           # Dependencies and scripts
```

## API Endpoints

- `GET /` - Homepage
- `GET /login` - Login page
- `GET /signup` - Registration page
- `GET /app` - Main application
- `GET /saved-results` - User's saved results
- `POST /submit` - Process stock analysis
- `POST /api/save-results` - Save results (authenticated)
- `GET /api/results` - Get user's results (authenticated)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (ES6 modules)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Templating**: EJS
- **Styling**: Custom CSS with Google Fonts (Xanh Mono)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created by Hector Garingalao Sevilla.

## Support

For setup issues, check `FIREBASE_SETUP.md` or create an issue in the repository.
