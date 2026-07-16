function PortfolioSummary({todayGain, totalGain}: {todayGain: number, totalGain: number }) {
// function PortfolioSummary({todayGain, totalGain, bestStockToday, bestStockOverall}: {todayGain: number, totalGain: number, bestStockToday: string, bestStockOverall: string}) {
    return (
        <div>
            <p>today gain: {todayGain}</p>
            <p>total gain: {totalGain}</p>
        </div>
    )

}

export default PortfolioSummary;