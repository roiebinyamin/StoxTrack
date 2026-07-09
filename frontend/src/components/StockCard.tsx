import {useState} from "react";
import React from "react";

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
    id: number;
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

    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<StockEvent[]>([]);

    const [updateId, setUpdateId] = useState<number | null>(null)
    const [updateType, setUpdateType] = useState<string | null>(null)
    const [updatedAmount, setUpdatedAmount] = useState<number | "">("")
    const [updatedDate, setUpdatedDate] = useState("");

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
        setShowBuyForm(false)
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
        const response = await fetch(`/api/transactions/${transaction.stockSymbol}`);
        const data = await response.json();

        setShowHistory(!showHistory);
        setHistory(data)
    }

    async function handleUpdate() {
        await fetch('/api/updateStock', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: updateId,
                type: updateType,
                boughtAmount: updatedAmount,
                boughtDate: updatedDate
            })
        })

        setUpdateId(null);
        setUpdatedAmount("")
        setUpdatedDate("")
        setUpdateType(null)
        onUpdate()
        handleHistory()
    }

    async function handleDelete(id: number) {
        await fetch('/api/deleteStock', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
            })
        })
        onUpdate()
        handleHistory()
    }

    return (
        <>
            <div>
            <h2>{transaction.stockSymbol}</h2>
            <p>Shares owned: {transaction.amount.toFixed(4)}, Total money invested: {transaction.totalInvested.toFixed(4)}, Start of investing: {transaction.buyDate}</p>
            <p>Current money: {transaction.currentValue.toFixed(4)}, Total money sold: {transaction.totalSold.toFixed(4)}, Total gain: {transaction.gain.toFixed(4)}</p>
            <button onClick={() => {setShowBuyForm(!showBuyForm);setShowSellForm(false);setShowHistory(false)}}>Buy</button>
            {showBuyForm && (
                <div>
                    <input
                        type="number"
                        placeholder="Amount of bought shares"
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
            <button onClick={() => {setShowSellForm(!showSellForm);setShowHistory(false);setShowBuyForm(false)}}>Sell</button>
            {showSellForm && (
                <div>
                    <input
                        type="number"
                        placeholder="Amount of sold shares"
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
            <button onClick={() => {handleHistory();setShowBuyForm(false);setShowSellForm(false)}}>History</button>
            {showHistory &&
                <div>
                    {history.map(t => (
                        <React.Fragment key={`${t.id}-${t.type}`}>
                            {t.type == "buy" &&
                                <p style={{color:"limegreen"}}>{t.date} - {t.amount.toFixed(2)} shares of {transaction.stockSymbol} was bought at {t.price.toFixed(2)} for {(t.amount * t.price).toFixed(2)}</p>
                            }
                            {t.type == "sell" &&
                                <p style={{color:"red"}}>{t.date} - {t.amount.toFixed(2)} shares of {transaction.stockSymbol} was sold at {t.price.toFixed(2)} for {(t.amount * t.price).toFixed(2)}</p>
                            }
                            <button onClick={() => {setUpdateId(t.id);setUpdateType(t.type);setUpdatedAmount(t.amount);setUpdatedDate(t.date)}}>Update</button>
                            {updateId === t.id && t.type === updateType &&(
                                <div>
                                    <input
                                        type="number"
                                        value={updatedAmount}
                                        onChange={(e) =>setUpdatedAmount(Number(e.target.value))}
                                    />
                                    <input
                                        type="date"
                                        value={updatedDate}
                                        onChange={(e) =>setUpdatedDate(e.target.value)}
                                    />
                                    <button onClick={() => handleUpdate()}>Confirm</button>
                                </div>
                            )}
                                <button onClick={()=> {
                                    if (window.confirm("Are you sure you want to delete this transaction?")) {
                                        handleDelete(t.id);
                                    }
                                }}>Delete</button>
                        </React.Fragment>
                    ))}
                    <br/>

                    <button onClick={() => setShowHistory(false)}>Close</button>
                </div>
            }
        </div>
        </>
    );
}

export default StockCard
