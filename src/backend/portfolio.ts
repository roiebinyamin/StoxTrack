import {
    addTransaction, getTransactions, deleteTransaction, getTransactionById, updateTransaction, getTransactionBySymbol,
    type Transaction,
} from "./database.js";
import {
    getCurrentStockPrice,
    getRangeStockPrice,
    getDayStockPrice,
    getInterDayStockPrice,
    isMarketOpen
} from "./stockService.js"

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

export async function getGroupedTransactionsForSymbol(stockSymbol: string){
    const transactions = getTransactionBySymbol(stockSymbol);
    if (transactions.length == 0)
        throw new Error("User didn't invest in this stock!");
    let groupedTransactions: {stockSymbol: String, amount: number, totalInvested: number, buyDate: string, currentValue: number, totalSold: number, gain: number }
    const currentPrice = await getCurrentStockPrice(stockSymbol);
    if (!currentPrice)
        throw new Error("No price found");
    groupedTransactions = {
        stockSymbol: stockSymbol,
        amount: 0,
        totalInvested: 0,
        buyDate: transactions[0]!.date,
        currentValue: 0,
        totalSold: 0,
        gain: 0
    }
    for (const transaction of transactions) {
        if (transaction.type == "buy"){
            groupedTransactions.amount += transaction.amount;
            groupedTransactions.totalInvested += transaction.amount * transaction.price;
            groupedTransactions.currentValue += transaction.amount * currentPrice;
        }
        if (transaction.type == "sell"){
            groupedTransactions.amount -= transaction.amount;
            groupedTransactions.currentValue -= transaction.amount * currentPrice;
            groupedTransactions.totalSold += transaction.amount * transaction.price;
        }
    }
    groupedTransactions.gain = (groupedTransactions.currentValue + groupedTransactions.totalSold) - (groupedTransactions.totalInvested)
    return groupedTransactions;
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

//portfolio functions
function getPortfolioShares(transactions: Transaction[]){
    const sharesHeld: { [stockSymbol: string]: number } = {};
    for (const transaction of transactions) {
        if (transaction.type == "buy")
            sharesHeld[transaction.stockSymbol] = (sharesHeld[transaction.stockSymbol] ?? 0) + transaction.amount;
        if (transaction.type == "sell")
            sharesHeld[transaction.stockSymbol] = (sharesHeld[transaction.stockSymbol] ?? 0) - transaction.amount;
    }
    return sharesHeld;
}

export async function getPortfolioHistory(startDate: string, endDate: string){
    const transactions = getTransactions();
    const stockSymbols = Array.from(new Set(transactions.map(t => t.stockSymbol)));
    const transactionsUntilStartDate = transactions.filter(t => t.date < startDate)
    const portfolioValueByDate: { [date: string]: number } = {};
    const sharesHeld: { [stockSymbol: string]: number } = getPortfolioShares(transactionsUntilStartDate);

    for (const stockSymbol of stockSymbols) {
        let prices = await getRangeStockPrice(stockSymbol, new Date(startDate), new Date(endDate));
        for (const price of prices) {
            let currentTransactions = transactions.filter(t => t.stockSymbol == stockSymbol && t.date == price.date.toISOString().slice(0, 10));
            sharesHeld[stockSymbol] = (sharesHeld[stockSymbol] ?? 0) + getStockShares(currentTransactions);
            portfolioValueByDate[price.date.toISOString().slice(0,10)] = (portfolioValueByDate[price.date.toISOString().slice(0,10)] ?? 0) + sharesHeld[stockSymbol]! * price.close;
        }
    }
    return Object.entries(portfolioValueByDate).map(([date, value]) => ({date, value}));
}

export async function getPortfolioInterday(){
    const transactions = getTransactions();
    const sharesHeld: { [stockSymbol: string]: number } = getPortfolioShares(transactions);
    const portfolioValueByTime: { [time: string]: number } = {};

    for (const stockSymbol in sharesHeld) {
        let prices = await getInterDayStockPrice(stockSymbol);
        for (const price of prices) {
            if (price.close)
                portfolioValueByTime[price.date.toISOString().slice(11, 16)] = sharesHeld[stockSymbol]! * price.close;
        }
    }
    return Object.entries(portfolioValueByTime).map(([date, value]) => ({date, value}));
}

export async function getTodayPortfolioGain(){
    let totalGain = 0;
    const transactions = getTransactions();
    const stockSymbols = Array.from(new Set(transactions.map(t => t.stockSymbol)));
    for (const stockSymbol of stockSymbols) {
        totalGain += await getTodayStockGain(stockSymbol);
    }
    return totalGain;
}

export async function getTotalPortfolioGain(){
    const transactions = await getGroupedTransactions();
    let totalGain = 0;
    for (const transaction of transactions) {
        totalGain += transaction.gain;
    }
    return totalGain;
}

//stock functions
function getStockShares(transactions: Transaction[]){
    let sharesHeld = 0;
    for (const transaction of transactions) {
        if (transaction.type == "buy")
            sharesHeld += transaction.amount;
        if (transaction.type == "sell")
            sharesHeld -= transaction.amount;
    }
    return sharesHeld;
}

export async function getStockHistory(stockSymbol: string, startDate: string, endDate: string){
    const transactions = getTransactionBySymbol(stockSymbol);
    const transactionsUntilStartDate = transactions.filter(t => t.date < startDate)
    let sharesHeld = getStockShares(transactionsUntilStartDate);

    const portfolioValueByDate: { [date: string]: number } = {};
    let prices = await getRangeStockPrice(stockSymbol, new Date(startDate), new Date(endDate));
    for (const price of prices) {
        let currentTransactions = transactions.filter(t => t.date == price.date.toISOString().slice(0, 10));
        sharesHeld += getStockShares(currentTransactions);
        portfolioValueByDate[price.date.toISOString().slice(0,10)] = sharesHeld * price.close;
    }
    return Object.entries(portfolioValueByDate).map(([date, value]) => ({date, value}));
}

export async function getStockInterday(stockSymbol: string){
    const prices = await getInterDayStockPrice(stockSymbol);
    const transactions = getTransactionBySymbol(stockSymbol);
    const portfolioValueByTime: { [time: string]: number } = {};
    let sharesHeld = getStockShares(transactions);

    for (const price of prices) {
        if (price.close)
            portfolioValueByTime[price.date.toISOString().slice(11, 16)] = sharesHeld * price.close;
    }
    return Object.entries(portfolioValueByTime).map(([date, value]) => ({date, value}));
}

export async function getTodayStockGain(stockSymbol: string){
    const now = new Date();
    const price = await getDayStockPrice(stockSymbol, now);
    if (!price){
        console.log("No price found for today");
        return 0;
    }
    if (!await isMarketOpen(stockSymbol)) {
        return 0;
    }
    else {
        const transactions = getTransactionBySymbol(stockSymbol);
        const sharesHeld = getStockShares(transactions);
        const todayPrice = await getCurrentStockPrice(stockSymbol);
        const yesterdayPrice = await getDayStockPrice(stockSymbol, new Date(now.getTime() - 24 * 60 * 60 * 1000));
        if (!todayPrice)
            throw new Error("No price found for today");
        if (!yesterdayPrice)
            throw new Error("No price found for yesterday");
        if (todayPrice == yesterdayPrice.close.toFixed(2))
            return 0;
        return Number((sharesHeld * (todayPrice - yesterdayPrice.close)).toFixed(4));
    }
}