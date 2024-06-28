// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { calculateInvestments, calculateShares, calculatePercentages, calculateTotalInvestment, calculateAmountShares } = require('./public/stockTradeGenerator');

const app = express();
const port = 3000;

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
  const {
    name,
    capital,
    stockCompany1,
    stock1Price,
    stockCompany2,
    stock2Price,
    stockCompany3,
    stock3Price,
    stockCompany4,
    stock4Price,
    stockCompany5,
    stock5Price
  } = req.body;

  const stockPrices = [
    { name: stockCompany1, price: parseFloat(stock1Price) },
    { name: stockCompany2, price: parseFloat(stock2Price) },
    { name: stockCompany3, price: parseFloat(stock3Price) },
    { name: stockCompany4, price: parseFloat(stock4Price) },
    { name: stockCompany5, price: parseFloat(stock5Price) }
  ];

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
    stockCompany1,
    stock1Price,
    stockCompany2,
    stock2Price,
    stockCompany3,
    stock3Price,
    stockCompany4,
    stock4Price,
    stockCompany5,
    stock5Price,
    stock1InvestAmount: investments[0].amount,
    stock2InvestAmount: investments[1].amount,
    stock3InvestAmount: investments[2].amount,
    stock4InvestAmount: investments[3].amount,
    stock5InvestAmount: investments[4].amount,
    shareBuyAverage: averageShares,
    totalInvestmentAmount: totalInvestment,
    totalAmountShares: amountShares,
    stock1Percent: percentages[0].percent,
    stock2Percent: percentages[1].percent,
    stock3Percent: percentages[2].percent,
    stock4Percent: percentages[3].percent,
    stock5Percent: percentages[4].percent
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
