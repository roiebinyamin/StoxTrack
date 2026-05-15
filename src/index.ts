import {addTransaction, getTransactions, sellStock, updateTransaction, deleteTransaction} from "./database.js";
import {getCurrentStockPrice, getRangeStockPrice} from "./stockService.js"

addTransaction("AAPL", 100, "2023-01-01", 100);

const investment = getTransactions();
const blah = investment[0];
if (blah) {
    console.log(await getRangeStockPrice(blah.stockSymbol, new Date(blah.boughtDate), new Date()));
}