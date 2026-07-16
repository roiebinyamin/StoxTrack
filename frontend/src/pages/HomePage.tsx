import {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import PortfolioChart from "../components/PortfolioChart.tsx";
import PortfolioSummary from "../components/PortfolioSummary.tsx";

interface GroupedTransaction {
    stockSymbol: string
    amount: number
    totalInvested: number
    buyDate: string
    currentValue: number
    totalSold: number
    gain: number
}

interface PortfolioPoint {
    date: string;
    value: number;
}

function HomePage() {
    const [transactions, setTransactions] = useState<GroupedTransaction[]>([])
    const [portfolio, setPortfolio] = useState<PortfolioPoint[]>([])
    const [todayGain, setTodayGain] = useState<number>(0)

    const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));

    async function loadData() {
        const response = await fetch('/api/groupedTransactions');
        const data = await response.json();
        setTransactions(data);
    }

    async function loadPortfolio() {
        const response = await fetch(`/api/portfolioHistory?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setPortfolio(data);
    }

    async function loadPortfolioInterday(){
        const response = await fetch(`/api/portfolioInterday`);
        const data = await response.json();
        setPortfolio(data);
    }

    async function loadTodayGain(){
        const response = await fetch(`/api/todayPortfolioGain`);
        const data = await response.json();
        setTodayGain(data);
    }

    function handleRangeChange(startDate: string, endDate: string) {
        setStartDate(startDate);
        setEndDate(endDate);
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
        loadTodayGain();
    }, []);

    useEffect(() => {
        if (startDate != endDate)
            loadPortfolio();
        else
            loadPortfolioInterday();
    }, [startDate, endDate]);

    return (
        <div>
            <title>StoxTrack</title>
            <h1>StoxTrack</h1>
            <h2>Your Stocks</h2>
            {transactions.map(t => (
                <div>
                    <Link to={`/stock/${t.stockSymbol}`}>{t.stockSymbol}</Link>
                </div>
            ))}
            <br/>
            <PortfolioSummary todayGain={todayGain}/>
            <br/>
            <PortfolioChart data={portfolio} onRangeChange={handleRangeChange} firstDate={transactions[0]?.buyDate}/>
            <br/>
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

export default HomePage