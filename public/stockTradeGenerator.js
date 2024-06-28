// public/stockTradeGenerator.js

function calculateInvestments(capital, stockPrices) {
  const totalStockPrice = stockPrices.reduce((sum, stock) => sum + stock.price, 0);

  return stockPrices.map(stock => {
    return {
      name: stock.name,
      amount: (stock.price / totalStockPrice) * capital
    };
  });
}

function calculateShares(investments, stockPrices) {
  return stockPrices.map((stock, index) => {
    return {
      name: stock.name,
      shares: Math.round(investments[index].amount / stock.price)
    };
  });
}

function calculatePercentages(investments, capital) {
  return investments.map(investment => {
    return {
      name: investment.name,
      percent: Math.round((investment.amount / capital) * 100)
    };
  });
}

function calculateTotalInvestment(investments) {
  return investments.reduce((total, investment) => total + investment.amount, 0);
}

function calculateAmountShares(shares, stockPrices) {
  return shares.reduce((total, share, index) => {
    return total + (share.shares * stockPrices[index].price);
  }, 0);
}

module.exports = {
  calculateInvestments,
  calculateShares,
  calculatePercentages,
  calculateTotalInvestment,
  calculateAmountShares
};
