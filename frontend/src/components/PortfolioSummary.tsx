function PortfolioSummary({todayGain, totalGain, todayBestStock, totalBestStock}: {todayGain: number, totalGain: number, todayBestStock: string, totalBestStock: string }) {
    return (
        <div>
            <p>today gain: {todayGain}</p>
            <p>total gain: {totalGain}</p>
            <p>today best stock: {todayBestStock}</p>
            <p>total best stock: {totalBestStock}</p>
        </div>
    )

}

export default PortfolioSummary;