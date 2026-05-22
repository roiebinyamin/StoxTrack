import {useState} from "react";

interface GroupedTransaction {
    stockSymbol: string
    amount: number
    totalInvested: number
    buyDate: string
    currentValue: number
    totalSold: number
    gain: number
}

interface StockEvent {
    date: string;
    type: string;
    amount: number;
    price: number;
    total: number;
}

interface StockCardProps {
    transaction: GroupedTransaction;
    onUpdate: () => void;
}

function StockCard({transaction, onUpdate}: StockCardProps) {
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [buyAmount, setBuyAmount] = useState<number | "">("")
    const [buyDate, setBuyDate] = useState("");

    const [showSellForm, setShowSellForm] = useState(false);
    const [sellAmount, setSellAmount] = useState<number | "">("")
    const [sellDate, setSellDate] = useState("");

    const[showHistory, setShowHistory] = useState(false);
    const[history, setHistory] = useState<StockEvent[]>([]);

    async function handleBuy() {
        await fetch('/api/buyStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stockSymbol: transaction.stockSymbol,
                boughtAmount: buyAmount,
                boughtDate: buyDate
            })
        })
        setShowBuyForm(false) // hide the form after submitting
        onUpdate()
    }

    async function handleSell() {
        await fetch('/api/sellStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stockSymbol: transaction.stockSymbol,
                amountSold: sellAmount,
                soldDate: sellDate
            })
        })
        setShowSellForm(false)
        onUpdate()
    }

    async function handleHistory() {
        const response = await fetch(`/api/timeline/${transaction.stockSymbol}`);
        const data = await response.json();

        setShowHistory(!showHistory);
        setHistory(data)
    }

    return (
        <div>
            <h2>{transaction.stockSymbol}</h2>
            <p>Shares owned: {transaction.amount.toFixed(2)}, Total money invested: {transaction.totalInvested.toFixed(2)}, Start of investing: {transaction.buyDate}</p>
            <p>Current money: {transaction.currentValue.toFixed(2)}, Total money sold: {transaction.totalSold.toFixed(2)}, Total gain: {transaction.gain.toFixed(2)}</p>
            <button onClick={() => setShowBuyForm(!showBuyForm)}>Buy</button>
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
                    <button onClick={() => handleBuy()}>Confirm</button>
                </div>
            )}
            <button onClick={() => setShowSellForm(!showSellForm)}>Sell</button>
            {showSellForm && (
                <div>
                    <input
                        type="number"
                        placeholder="Amount of shares"
                        value={sellAmount}
                        onChange={(e) =>setSellAmount(Number(e.target.value))}
                    />
                    <input
                        type="date"
                        value={sellDate}
                        onChange={(e) =>setSellDate(e.target.value)}
                    />
                    <button onClick={() => handleSell()}>Confirm</button>
                </div>
            )}
            <button onClick={() => handleHistory()}>History</button>
            {showHistory &&
                <div>
                    {history.map(t => (
                        <>
                            {t.type == "buy" &&
                                <p style={{color:"limegreen"}}>{t.date} - {t.amount.toFixed(2)} shares of {transaction.stockSymbol} was bought at {t.price.toFixed(2)} for {t.total.toFixed(2)}</p>
                            }
                            {t.type == "sell" &&
                                <p style={{color:"red"}}>{t.date} - {t.amount.toFixed(2)} shares of {transaction.stockSymbol} was sold at {t.price.toFixed(2)} for {t.total.toFixed(2)}</p>
                            }
                        </>
                    ))}
                    <button onClick={() => setShowHistory(false)}>Close</button>
                </div>
            }
        </div>
    )
}

export default StockCard
