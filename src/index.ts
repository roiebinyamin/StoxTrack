import YahooFinance from "yahoo-finance2"

async function getStockPrice(stockName: string) {
    const stockGetter = new YahooFinance({suppressNotices: ['yahooSurvey']});

    const stock = await stockGetter.quote(stockName)

    return await stock.regularMarketPrice;
}

console.log(await getStockPrice("AAPL"));