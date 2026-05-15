import YahooFinance from "yahoo-finance2"

const stockGetter = new YahooFinance({suppressNotices: ['yahooSurvey', 'ripHistorical']});

export async function getCurrentStockPrice(stockName: string) {
    const stock = await stockGetter.quote(stockName)
    return stock.regularMarketPrice;
}

export async function getRangeStockPrice(stockName: string, startDate : Date, endDate : Date) {
    const realEndDate = new Date(endDate.getTime() + 1000 * 60 * 60 * 24);
    const stock = await stockGetter.historical(stockName, {period1: startDate, period2: realEndDate})
    return stock.map(x => ({ close: x.close, date: x.date}));
}