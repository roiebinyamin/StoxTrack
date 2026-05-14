import YahooFinance from "yahoo-finance2"
import {addTransaction, getTransactions} from "./database.js";

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

console.log(getTransactions());