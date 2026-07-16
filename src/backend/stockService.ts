import YahooFinance from "yahoo-finance2"

const stockGetter = new YahooFinance({suppressNotices: ['yahooSurvey', 'ripHistorical']});

export async function getCurrentStockPrice(stockSymbol: string) {
    const stock = await stockGetter.quote(stockSymbol)
    return stock.regularMarketPrice;
}

export async function getRangeStockPrice(stockSymbol: string, startDate : Date, endDate : Date) {
    const realEndDate = new Date(endDate.getTime() + 1000 * 60 * 60 * 24);
    const stock = await stockGetter.historical(stockSymbol, {period1: startDate, period2: realEndDate})
    return stock.map(x => ({ close: x.close, date: x.date}));
}

export async function getDayStockPrice(stockSymbol: string, date: Date) {
    const prices = await getRangeStockPrice(stockSymbol, new Date(date.getTime() - 5 * 1000 * 60 * 60 * 24) , date)
    return prices[prices.length -1];
}

export async function getInterDayStockPrice(stockSymbol: string){
    let wantedStartDate = new Date();
    let prices
    if (! await isMarketOpen(stockSymbol))
        wantedStartDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    prices = await stockGetter.chart(stockSymbol, {period1: new Date(wantedStartDate.getUTCFullYear(), wantedStartDate.getUTCMonth(), wantedStartDate.getUTCDate(), -(wantedStartDate.getTimezoneOffset() / 60)), interval: "30m"})
    return prices.quotes
}

export async function isMarketOpen(stockSymbol: string){
    const stock = await stockGetter.quote(stockSymbol)
    return stock.marketState === "REGULAR"
}