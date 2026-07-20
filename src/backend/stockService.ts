import YahooFinance from "yahoo-finance2"
import {ONE_DAY} from "./constants.js"

const stockGetter = new YahooFinance({suppressNotices: ['yahooSurvey', 'ripHistorical']});

export async function getExchangeRate(currency: string) {
    if (currency === "USD")
        return 1;
    else{
        const currencyData = await stockGetter.quote(currency+"=X")
        return currencyData.regularMarketPrice
    }
}

export async function getCurrentStockPrice(stockSymbol: string) {
    const stock = await stockGetter.quote(stockSymbol)
    return stock.regularMarketPrice / await getExchangeRate(stock.currency)
}

export async function getRangeStockPrice(stockSymbol: string, startDate : Date, endDate : Date) {
    const realEndDate = new Date(endDate.getTime() + ONE_DAY)
    const stock = await stockGetter.chart(stockSymbol, {period1: startDate, period2: realEndDate , interval: "1d"})
    return await Promise.all(stock.quotes.map(async x => ({ close: x.close! / await getExchangeRate(stock.meta.currency), date: x.date})));
}

export async function getDayStockPrice(stockSymbol: string, date: Date) {
    const prices = await getRangeStockPrice(stockSymbol, new Date(date.getTime() - 5 * ONE_DAY) , date)
    return prices[prices.length -1];
}

export async function getInterDayStockPrice(stockSymbol: string){
    let wantedStartDate = new Date();
    let prices
    if (! await isMarketOpen(stockSymbol))
        wantedStartDate = new Date(Date.now() - ONE_DAY);
    prices = await stockGetter.chart(stockSymbol, {period1: new Date(wantedStartDate.getUTCFullYear(), wantedStartDate.getUTCMonth(), wantedStartDate.getUTCDate(), -(wantedStartDate.getTimezoneOffset() / 60)), interval: "30m"})
    return await Promise.all(prices.quotes.map(async x => ({ close: x.close! / await getExchangeRate(prices.meta.currency), date: x.date})));
}

export async function isMarketOpen(stockSymbol: string){
    const stock = await stockGetter.quote(stockSymbol)
    return stock.marketState === "REGULAR"
}