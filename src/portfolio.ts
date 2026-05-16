import {addTransaction, getTransactions, sellStock, updateTransaction, deleteTransaction} from "./database.js";
import {getCurrentStockPrice, getRangeStockPrice, getDayStockPrice} from "./stockService.js"

export async function buyStock(stockSymbol: string, boughtAmount: number, boughtDate: string){
    const boughtPrice = await getDayStockPrice(stockSymbol, new Date(boughtDate));
    if (!boughtPrice)
        throw new Error("No price found");
    addTransaction(stockSymbol, boughtAmount, boughtDate, boughtPrice.close)
}

export async function sellUserStock(stockSymbol: string, amountSold: number, soldDate: string){
    const soldPrice = await getDayStockPrice(stockSymbol, new Date(soldDate));
    if (!soldPrice)
        throw new Error("No price found");
    sellStock(stockSymbol, amountSold, soldDate,soldPrice.close )
}

export async function getPortfolio(){
    const transactions = getTransactions();
    let boughtSum = 0;
    let soldSum = 0;
    let currentSum  = 0;
    let currentStockPrice = 0;
    const priceCache: { [symbol: string]: number } = {};
    for (const transaction of transactions) {
        if (transaction.soldDate)
            soldSum += transaction.amountSold * transaction.soldPrice;
        boughtSum += transaction.boughtAmount * transaction.boughtPrice;
        if (transaction.currentAmount == 0)
            continue;
        if (!priceCache[transaction.stockSymbol]) {
            const fetchedPrice = await getCurrentStockPrice(transaction.stockSymbol);
            if (!fetchedPrice)
                throw new Error("No price found");
            currentStockPrice = fetchedPrice;
            priceCache[transaction.stockSymbol] = currentStockPrice;
        }
        else
            currentStockPrice = priceCache[transaction.stockSymbol]!;
        currentSum += transaction.currentAmount * currentStockPrice
    }
    return (currentSum + soldSum) - boughtSum;
}