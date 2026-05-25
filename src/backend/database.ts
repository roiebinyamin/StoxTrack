import Database from "better-sqlite3";
import {fileURLToPath} from "url";
import {dirname, join} from "path"

const __dirname = dirname(fileURLToPath(import.meta.url));
const database = new Database(join(__dirname,"stoxTrack.db"));
export interface Transaction {
    id: number;
    stockSymbol: string;
    amount: number;
    date: string;
    price: number;
    type: string;
}

database.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
            stockSymbol TEXT,
            amount REAL,
            date TEXT,
            price REAL,
            type TEXT
    )
`);

export function addTransaction(stockSymbol: string, amount: number, date: string, price: number, type: string) {
    database.prepare(`INSERT INTO transactions (stockSymbol, amount, date, price, type) VALUES (?, ?, ?, ?, ?)`).run(stockSymbol, amount, date, price, type);
}

export function getTransactions(){
    return database.prepare(`SELECT * FROM transactions ORDER BY date ASC`).all() as Transaction[];
}

export function updateTransaction(id: number, newAmount: number, newDate: string, newPrice: number, newType: string) {
    database.prepare(`UPDATE transactions SET amount = ?, date = ?, price = ?, type = ? WHERE id = ?`).run(newAmount, newDate, newPrice, newType, id);
}

export function deleteTransaction(id: number){
    database.prepare(`DELETE FROM transactions WHERE id = ?`).run(id);
}

export function getTransactionById(id: number){
    return database.prepare(`SELECT * FROM transactions WHERE id = ?`).get(id) as Transaction
}

export function getTransactionBySymbol(stockSymbol: string){
    return database.prepare(`SELECT * FROM transactions WHERE stockSymbol = ? ORDER BY date ASC`).all(stockSymbol) as Transaction[]
}