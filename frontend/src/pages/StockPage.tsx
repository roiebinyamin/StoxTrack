import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import StockCard from "../components/StockCard.tsx";
import PortfolioChart from "../components/PortfolioChart.tsx";

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

function StockPage() {
    const { symbol } = useParams();
    const [portfolio, setPortfolio] = useState<PortfolioPoint[]>([])

    const [transactions, setTransactions] = useState<GroupedTransaction>()
    const [notFound, setNotFound] = useState(false)

    async function loadData() {
        const response = await fetch(`/api/groupedTransactions/${symbol}`);
        if (response.status === 404) {
            setNotFound(true)
            return;
        }
        const data = await response.json();
        setTransactions(data);
    }

    async function loadStockPortfolio() {
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const response = await fetch(`/api/stockHistory/${symbol}?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setPortfolio(data);
    }

    useEffect(()=> {
        loadData()
    }, [])

    useEffect(()=> {
        document.title = `StoxTrack - ${symbol}`;
    }, [symbol])

    useEffect(() => {
        loadStockPortfolio();
    }, []);

    if (notFound) {
        return (
            <div>
                <title>StoxTrack - not found stock!</title>
                <h1 style={{color:"red", lineHeight:"1.5"}}>User does not have any transactions for this stock symbol/ Stock symbol not found</h1>
            </div>
        )
    }

    if (transactions === undefined) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <div>
            <title>{symbol} - StoxTrack</title>
            <h1>{symbol} Page!</h1>
            <StockCard key={transactions.stockSymbol} transaction={transactions} onUpdate={loadData}/>
            <br/>
            <PortfolioChart data={portfolio} />
        </div>
    )
}

export default StockPage