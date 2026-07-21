import {useParams} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import StockCard from "../components/StockCard.tsx";
import PortfolioChart from "../components/PortfolioChart.tsx";
import StockSummary from "../components/StockSummary.tsx";
import {CurrencyContext} from "../App.tsx";
import {ONE_DAY} from "../../../src/backend/constants.ts";
import PageContainer from "../components/PageContainer.tsx";

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
    const [todayGain, setTodayGain] = useState<number>(0)

    const [transactions, setTransactions] = useState<GroupedTransaction>()
    const [notFound, setNotFound] = useState(false)

    const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 7 * ONE_DAY).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));

    const {currency} = useContext(CurrencyContext);
    const [exchangeRate, setExchangeRate] = useState<number>(1);

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
        const response = await fetch(`/api/stockHistory/${symbol}?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setPortfolio(data);
    }

    async function loadStockInterday(){
        const response = await fetch(`/api/stockInterday/${symbol}`);
        const data = await response.json();
        setPortfolio(data);
    }

    async function loadTodayGain(){
        const response = await fetch(`/api/todayStockGain/${symbol}`);
        const data = await response.json();
        setTodayGain(data);
    }

    async function updateExchangeRate() {
        const response = await fetch(`/api/currencyExchangeRate/${currency}`);
        const data = await response.json();
        setExchangeRate(data);
    }

    function handleRangeChange(startDate: string, endDate: string) {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    useEffect(()=> {
        loadData()
        loadTodayGain()
    }, [])

    useEffect(()=> {
        document.title = `StoxTrack - ${symbol}`;
    }, [symbol])

    useEffect(() => {
        if (startDate != endDate)
            loadStockPortfolio();
        else
            loadStockInterday();
    }, [startDate, endDate]);

    useEffect(() => {
            updateExchangeRate();
    }, [currency]);

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
        <PageContainer>
            <title>{symbol} - StoxTrack</title>
            <h1>{symbol} Page!</h1>
            <StockCard key={transactions.stockSymbol} transaction={transactions} onUpdate={loadData} exchangeRate={exchangeRate}/>
            <br/>
            <StockSummary todayGain={todayGain} totalGain={Number(transactions.gain.toFixed(4))} exchangeRate={exchangeRate}/>
            <PortfolioChart data={portfolio} onRangeChange={handleRangeChange} firstDate={transactions.buyDate} exchangeRate={exchangeRate}/>
        </PageContainer>
    )
}

export default StockPage