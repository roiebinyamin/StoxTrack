function PortfolioSummary({todayGain}: {todayGain: number }) {
// function PortfolioSummary({todayGain, totalGain, bestStockToday, bestStockOverall}: {todayGain: number, totalGain: number, bestStockToday: string, bestStockOverall: string}) {
    return (
        <div>
            <p>today gain - {todayGain}</p>
        </div>
    )

}

export default PortfolioSummary;