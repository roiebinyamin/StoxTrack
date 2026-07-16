function StockSummary({todayGain, totalGain}: {todayGain: number, totalGain: number}) {
    return (
        <div>
            <p>today gain: {todayGain}</p>
            <p>total gain: {totalGain}</p>
        </div>
    )
}

export default StockSummary;