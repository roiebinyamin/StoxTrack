import Database from "better-sqlite3";
import {fileURLToPath} from "url";
import {dirname, join} from "path"

const __dirname = dirname(fileURLToPath(import.meta.url));
const database = new Database(join(__dirname,"stoxTrack.db"));
export interface Transaction {
    id: number;
    stockSymbol: string;
    currentAmount: number;
    boughtAmount: number;
    boughtDate: string;
    boughtPrice: number;
    amountSold: number;
    soldDate: string | null;
    soldPrice: number;
}

database.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
            stockSymbol TEXT,
            currentAmount REAL,
            boughtAmount REAL,
            boughtDate TEXT,
            boughtPrice REAL,
            amountSold REAL DEFAULT 0,
            soldDate TEXT,
            soldPrice REAL DEFAULT 0
    )
`);

export function addTransaction(stockSymbol: string, boughtAmount: number, boughtDate: string, boughtPrice: number) {
    database.prepare(`INSERT INTO transactions (stockSymbol, currentAmount, boughtAmount, boughtDate, boughtPrice) VALUES (?, ?, ?, ?, ?)`).run(stockSymbol, boughtAmount, boughtAmount, boughtDate, boughtPrice);
}

export function getTransactions(){
    return database.prepare(`SELECT * FROM transactions`).all() as Transaction[];
}

export function sellStock(stockSymbol: string, amountSold: number , soldDate: string, soldPrice: number) {
    const allShares = database.prepare(`SELECT * FROM transactions WHERE stockSymbol = ? ORDER BY boughtDate`).all(stockSymbol) as Transaction[];
    const total = allShares.reduce((sum, row) => sum + row.currentAmount, 0)
    if (total < amountSold) {
        throw new Error("Not enough shares to sell");
    }
    let remainingToSell = amountSold;
    for (const row of allShares){
        let currentAmount = row.currentAmount;
        if (currentAmount < remainingToSell) {
            remainingToSell -= currentAmount;
            database.prepare('UPDATE transactions SET amountSold = amountSold + ?, soldDate = ?, soldPrice = ?, currentAmount = 0 WHERE id = ?').run(currentAmount, soldDate, soldPrice ,row.id);
        }
        else {
            database.prepare('UPDATE transactions SET amountSold = ?, soldDate = ?, soldPrice = ?, currentAmount = ? WHERE id = ?').run(remainingToSell, soldDate, soldPrice, currentAmount - remainingToSell, row.id);
            break
        }
    }
}

export function updateTransaction(id: number, boughtAmount: number, boughtDate: string, boughtPrice: number) {
    const row = database.prepare('SELECT amountSold FROM transactions WHERE id = ?').get(id) as Transaction;
    const amountSold = row.amountSold;
    database.prepare(`UPDATE transactions SET boughtAmount = ?, currentAmount = ?, boughtDate = ?, boughtPrice = ? WHERE id = ?`).run(boughtAmount, boughtAmount- amountSold, boughtDate, boughtPrice, id);
}

export function deleteTransaction(id: number){
    database.prepare(`DELETE FROM transactions WHERE id = ?`).run(id);
}

export function getTransactionById(id: number){
    return database.prepare(`SELECT * FROM transactions WHERE id = ?`).get(id) as Transaction
}