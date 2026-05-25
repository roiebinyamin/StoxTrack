import {
    addTransaction, getTransactions, deleteTransaction, getTransactionById, updateTransaction, getTransactionBySymbol,
    type Transaction
} from "./database.js";
import {getCurrentStockPrice, getRangeStockPrice, getDayStockPrice} from "./stockService.js"

export async function buyUserStock(stockSymbol: string, amount: number, date: string){
    const price = await getDayStockPrice(stockSymbol, new Date(date));
    if (!price)
        throw new Error("No price found");
    addTransaction(stockSymbol, amount, date, price.close, "buy")
}

export async function sellUserStock(stockSymbol: string, amount: number, date: string) {
    const transactions = getTransactionBySymbol(stockSymbol);
    let sumBought = 0;
    let sumSold = 0;

    for (const transaction of transactions) {
        if (transaction.type == "buy")
            sumBought += transaction.amount;
        if (transaction.type == "sell")
            sumSold += transaction.amount;
    }

    if (sumBought - sumSold >= amount) {
        const price = await getDayStockPrice(stockSymbol, new Date(date));
        if (!price)
            throw new Error("No price found");
        addTransaction(stockSymbol, amount, date, price.close, "sell")
    }
}

export function getAllTransactions(){return getTransactions()}

export async function updateUserStock(id: number, newType: string, newAmount: number, newDate: string){
    const transaction = getTransactionById(id);
    if (!transaction){
        throw new Error("Transaction not found!");
    }
    const symbol = transaction.stockSymbol;
    const newPrice = await getDayStockPrice(symbol,new Date(newDate))
    if (!newPrice)
        throw new Error("No price found!")
        updateTransaction(id, newAmount, newDate, newPrice.close, newType)
}

export function deleteUserStock(id: number){
    deleteTransaction(id);
}

export async function getPortfolio(){
   const transactions = getTransactions();
   let boughtSum = 0;
   let soldSum = 0;
   let totalSum = 0;
   const sharesHeld: { [symbol: string]: number } = {};
   const priceCache: { [symbol: string]: number } = {};

   for (const transaction of transactions) {
       if (!sharesHeld[transaction.stockSymbol])
           sharesHeld[transaction.stockSymbol] = 0;

       if (transaction.type == "buy"){
           sharesHeld[transaction.stockSymbol]! += transaction.amount;
           boughtSum += transaction.amount * transaction.price;
       }
       if (transaction.type == "sell"){
           sharesHeld[transaction.stockSymbol]! -= transaction.amount;
           soldSum += transaction.amount * transaction.price;
       }
   }

   for (const symbol in sharesHeld) {
       if (priceCache[symbol]){
           totalSum += sharesHeld[symbol]! * priceCache[symbol]!;
       }
       else{
           let fetchedPrice = await getCurrentStockPrice(symbol);
           if (!fetchedPrice)
               throw new Error("No price found");
           priceCache[symbol] = fetchedPrice;
           totalSum += fetchedPrice  * sharesHeld[symbol]!;
       }
   }

   return (totalSum + soldSum) - boughtSum;
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
            groupedTransactions[transaction.stockSymbol] = {
                amount: 0,
                totalInvested: 0,
                buyDate: transaction.date,
                currentValue: 0,
                totalSold: 0,
                gain: 0
            }
        }
        if (transaction.type == "buy"){
            groupedTransactions[transaction.stockSymbol]!.amount += transaction.amount;
            groupedTransactions[transaction.stockSymbol]!.totalInvested += transaction.amount * transaction.price;
            groupedTransactions[transaction.stockSymbol]!.currentValue += transaction.amount * priceCache[transaction.stockSymbol]!;
            if (new Date(transaction.date) < new Date(groupedTransactions[transaction.stockSymbol]!.buyDate))
                groupedTransactions[transaction.stockSymbol]!.buyDate = transaction.date;
        }
        if (transaction.type == "sell"){
            groupedTransactions[transaction.stockSymbol]!.amount -= transaction.amount;
            groupedTransactions[transaction.stockSymbol]!.currentValue -= transaction.amount * priceCache[transaction.stockSymbol]!;
            groupedTransactions[transaction.stockSymbol]!.totalSold += transaction.amount * transaction.price;
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
    return getTransactionBySymbol(stockSymbol);
}