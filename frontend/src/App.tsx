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

    useEffect(() => {
        loadData();
    }, []);
    console.log(transactions)

    return (
        <div>
            <h1>StoxTrack</h1>
            {transactions.map(t => (
                <StockCard key={t.stockSymbol} transaction={t} onUpdate={loadData}/>
            ))}
        </div>
    )
}

export default App