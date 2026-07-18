function StockSummary({todayGain, totalGain, exchangeRate}: {todayGain: number, totalGain: number, exchangeRate: number}) {
    return (
        <div>
            <p>today gain: {(todayGain * exchangeRate).toFixed(4)}</p>
            <p>total gain: {(totalGain * exchangeRate).toFixed(4)}</p>
        </div>
    )
}

export default StockSummary;