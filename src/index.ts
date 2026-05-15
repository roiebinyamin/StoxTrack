import YahooFinance from "yahoo-finance2"
import {addTransaction, getTransactions, sellStock} from "./database.js";

const stockGetter = new YahooFinance({suppressNotices: ['yahooSurvey', 'ripHistorical']});

async function getCurrentStockPrice(stockName: string) {
    const stock = await stockGetter.quote(stockName)
    return stock.regularMarketPrice;
}

async function getRangeStockPrice(stockName: string, startDate : Date, endDate : Date) {
    const realEndDate = new Date(endDate.getTime() + 1000 * 60 * 60 * 24);
    const stock = await stockGetter.historical(stockName, {period1: startDate, period2: realEndDate})
    return stock.map(x => ({ close: x.close, date: x.date}));
}

sellStock("AAPL", 120, "2024-01-01", 100)

// const investment = getTransactions();
// console.log(await getRangeStockPrice(investment[0].stockSymbol, investment[0].boughtDate, new Date()));