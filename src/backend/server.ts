import express from 'express';
import {
    buyStock,
    deleteUserStock,
    getAllTransactions,
    getGroupedTransactions,
    getAllTransactionsWithSymbol,
    getStockTimeline,
    getPortfolio,
    sellUserStock,
    updateUserStock
} from "./portfolio.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/portfolio', async (req, res) => {
    const portfolio = await getPortfolio();
    res.json(portfolio);
})

app.post('/api/buyStock', async(req, res) => {
    await buyStock(req.body.stockSymbol, req.body.boughtAmount, req.body.boughtDate);
    res.json({success: true});
    }
)

app.post('/api/sellStock', async(req, res) => {
    await sellUserStock(req.body.stockSymbol, req.body.amountSold, req.body.soldDate);
    res.json({success: true});
})

app.put('/api/updateStock', async(req, res) => {
    await updateUserStock(req.body.id, req.body.type,  req.body.boughtAmount, req.body.boughtDate);
    res.json({success: true});
})

app.delete('/api/deleteStock', async(req, res) => {
    deleteUserStock(req.body.id);
    res.json({success: true});
})

app.get('/api/transactions', (req, res) => {
    res.json(getAllTransactions());
})

app.get('/api/transactions/:symbol', (req , res) => {
    res.json(getAllTransactionsWithSymbol(req.params.symbol));
})

app.get('/api/timeline/:symbol', (req, res) => {
    res.json(getStockTimeline(req.params.symbol));
})

app.get('/api/groupedTransactions', async (req, res) => {
    res.json(await getGroupedTransactions());
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    console.log("To enter the api values, open http://localhost:3000/{add here the api value}");
    console.log("To stop the api, press Ctrl+C")
})
