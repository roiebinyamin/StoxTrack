import {addTransaction, getTransactions, sellStock, updateTransaction, deleteTransaction} from "./database.js";
import {getCurrentStockPrice, getRangeStockPrice} from "./stockService.js"

export async function buyStock(stockSymbol: string, boughtAmount: number, boughtDate: string){
    const boughtPrice = await getRangeStockPrice(stockSymbol, new Date(boughtDate), new Date(boughtDate));
    if (!boughtPrice[0])
        throw new Error("No price found");
    addTransaction(stockSymbol, boughtAmount, boughtDate, boughtPrice[0].close)
}