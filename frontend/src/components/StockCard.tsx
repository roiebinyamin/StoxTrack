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

interface StockCardProps {
    transaction: GroupedTransaction;
}

function StockCard({transaction}: StockCardProps) {
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [buyAmount, setBuyAmount] = useState(0);
    const [buyDate, setBuyDate] = useState("");

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
                    <button>Confirm</button>
                </div>
            )}
        </div>
    )
}

export default StockCard
