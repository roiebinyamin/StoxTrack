import Database from "better-sqlite3";

const database = new Database("stoxTrack.db");
database.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
            stockSymbol TEXT,
            sharesAmount REAL,
            boughtDate TEXT,
            boughtPrice REAL,
            amountSold REAL DEFAULT 0,
            soldDate TEXT,
            soldPrice REAL DEFAULT 0
    )
`);

export function addTransaction(stockSymbol: string, sharesAmount: number, boughtDate: string, boughtPrice: number) {
    database.prepare(`INSERT INTO transactions (stockSymbol, sharesAmount, boughtDate, boughtPrice) VALUES (?, ?, ?, ?)`).run(stockSymbol, sharesAmount, boughtDate, boughtPrice);
}

export function getTransactions(){
    return database.prepare(`SELECT * FROM transactions`).all();
}

export function sellStock(id: number, amountSold: number , soldDate: string, soldPrice: number) {
    database.prepare(`UPDATE transactions SET sharesAmount = sharesAmount-?, soldDate = ?, soldPrice = ?, amountSold = ? Where  id = ?`).run(amountSold, soldDate, soldPrice, amountSold, id);
}
