const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { calculateInvestments, calculateShares, calculatePercentages, calculateTotalInvestment, calculateAmountShares } = require('./public/stockTradeGenerator');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/app', (req, res) => {
  res.render('app');
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
