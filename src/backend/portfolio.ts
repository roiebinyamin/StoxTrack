import {addTransaction, getTransactions, sellStock, updateBought, updateSold, deleteTransaction, getTransactionById} from "./database.js";
import {getCurrentStockPrice, getRangeStockPrice, getDayStockPrice} from "./stockService.js"

interface StockEvent {
    date: string;
    type: string;
    amount: number;
    price: number;
    total: number;
    id: number;
}

export async function buyStock(stockSymbol: string, boughtAmount: number, boughtDate: string){
    const boughtPrice = await getDayStockPrice(stockSymbol, new Date(boughtDate));
    if (!boughtPrice)
        throw new Error("No price found");
    addTransaction(stockSymbol, boughtAmount, boughtDate, boughtPrice.close)
}

export async function sellUserStock(stockSymbol: string, amountSold: number, soldDate: string) {
    try {
        const soldPrice = await getDayStockPrice(stockSymbol, new Date(soldDate));
        if (!soldPrice)
        throw new Error("No price found");
        sellStock(stockSymbol, amountSold, soldDate, soldPrice.close)
    }
    catch (error) {
        console.log("User doesn't have enough shares!")
    }
}

export function getAllTransactions(){return getTransactions()}

export async function updateUserStock(id: number, type: string, newAmount: number, newDate: string){
    const transaction = getTransactionById(id);
    if (!transaction){
        throw new Error("Transaction not found!");
    }
    const symbol = transaction.stockSymbol;
    const newPrice = await getDayStockPrice(symbol,new Date(newDate))
    if (!newPrice)
        throw new Error("No price found!")
    if (type == "buy"){
        updateBought(id, newAmount, newDate, newPrice.close)
    }
    if (type == "sell"){
        updateSold(id, newAmount, newDate, newPrice.close)
    }
}

export function deleteUserStock(id: number){
    deleteTransaction(id);
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
            priceCache[transaction.stockSymbol] = fetchedPrice;
        }
        else
            currentStockPrice = priceCache[transaction.stockSymbol]!;
        currentSum += transaction.currentAmount * currentStockPrice
    }
    return (currentSum + soldSum) - boughtSum;
}
export async function getGroupedTransactions(){
    const transactions = getTransactions();
    const groupedTransactions: { [symbol: string]: { amount: number, totalInvested: number, buyDate: string, currentValue: number, totalSold: number, gain: number } } = {};
    const priceCache: { [symbol: string]: number } = {};
    for (const transaction of transactions) {
        if (!priceCache[transaction.stockSymbol]) {
            const fetchedPrice = await getCurrentStockPrice(transaction.stockSymbol);
            if (!fetchedPrice)
                throw new Error("No price found");
            priceCache[transaction.stockSymbol] = fetchedPrice;
        }
        if (!groupedTransactions[transaction.stockSymbol]) {
            groupedTransactions[transaction.stockSymbol] =
                {
                    amount: transaction.currentAmount,
                    totalInvested: transaction.boughtAmount * transaction.boughtPrice,
                    buyDate: transaction.boughtDate,
                    currentValue: transaction.currentAmount * priceCache[transaction.stockSymbol]!,
                    totalSold: transaction.amountSold * transaction.soldPrice,
                    gain: 0 //need to be getPortfolio()
                };
        }
        else {
            groupedTransactions[transaction.stockSymbol]!.amount += transaction.currentAmount;
            groupedTransactions[transaction.stockSymbol]!.totalInvested += transaction.boughtAmount * transaction.boughtPrice;
            groupedTransactions[transaction.stockSymbol]!.currentValue += transaction.currentAmount * priceCache[transaction.stockSymbol]!;
            groupedTransactions[transaction.stockSymbol]!.totalSold += transaction.amountSold * transaction.soldPrice;
            groupedTransactions[transaction.stockSymbol]!.gain += 0 //need to be getPortfolio()
            if (new Date(transaction.boughtDate) < new Date(groupedTransactions[transaction.stockSymbol]!.buyDate))
                groupedTransactions[transaction.stockSymbol]!.buyDate = transaction.boughtDate;
        }
    }
    for (const symbol in groupedTransactions) {
        groupedTransactions[symbol]!.gain = (groupedTransactions[symbol]!.currentValue + groupedTransactions[symbol]!.totalSold) - (groupedTransactions[symbol]!.totalInvested)
    }
    return Object.entries(groupedTransactions).map(([symbol, data]) => ({
        stockSymbol: symbol,
        amount: data.amount,
        totalInvested: data.totalInvested,
        buyDate: data.buyDate,
        currentValue: data.currentValue,
        totalSold: data.totalSold,
        gain: data.gain,
    }))
}

export function getAllTransactionsWithSymbol(stockSymbol: string){
    const transactions = getTransactions();
    return transactions.filter(t => t.stockSymbol == stockSymbol);
}

export function getStockTimeline(stockSymbol: string){
    const transactions = getAllTransactionsWithSymbol(stockSymbol);
    const stockEvents: StockEvent[] = [];
    for (const transaction of transactions){
        stockEvents.push({date: transaction.boughtDate, type: "buy", amount: transaction.boughtAmount, price: transaction.boughtPrice, total: transaction.boughtAmount * transaction.boughtPrice, id: transaction.id})
        if (transaction.soldDate){
            stockEvents.push({date: transaction.soldDate, type: "sell", amount: transaction.amountSold, price: transaction.soldPrice, total: transaction.amountSold * transaction.soldPrice, id: transaction.id})
        }
    }
    return stockEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}