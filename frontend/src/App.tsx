import {useEffect, useState} from "react"
import StockCard from "./components/StockCard.tsx";

interface GroupedTransaction {
    stockSymbol: string
    amount: number
    totalInvested: number
    buyDate: string
    currentValue: number
    totalSold: number
    gain: number
}

function App() {
    const [transactions, setTransactions] = useState<GroupedTransaction[]>([])

    async function loadData() {
        const response = await fetch('/api/groupedTransactions');
        const data = await response.json();
        setTransactions(data);
    }

    const [showBuyForm, setShowBuyForm] = useState(false);
    const [buyAmount, setBuyAmount] = useState<number | "">("")
    const [buyDate, setBuyDate] = useState("");
    const [stockSymbol, setStockSymbol] = useState("");

    async function handleBuy() {
        await fetch('/api/buyStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stockSymbol: stockSymbol,
                boughtAmount: buyAmount,
                boughtDate: buyDate
            })
        })
        setShowBuyForm(false)
        setStockSymbol("");
        setBuyAmount("");
        setBuyDate("");
        loadData();
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <title>StoxTrack</title>
            <h1>StoxTrack</h1>
            {transactions.map(t => (
                <StockCard key={t.stockSymbol} transaction={t} onUpdate={loadData}/>
            ))}
            <button onClick={() => setShowBuyForm(!showBuyForm)}>Create new Investment</button>
            {showBuyForm && (
                <div>
                    <input
                        type="number"
                        placeholder="Amount of shares"
                        value={buyAmount}
                        onChange={(e) =>setBuyAmount(Number(e.target.value))}
                    />
                    <input
                        type="date"
                        value={buyDate}
                        onChange={(e) =>setBuyDate(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Stock symbol"
                        value={stockSymbol}
                        onChange={(e) =>setStockSymbol(e.target.value)}
                    />
                    <button onClick={() => handleBuy()}>Confirm</button>
                </div>
            )}
        </div>
    )
}

export default App