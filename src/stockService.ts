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