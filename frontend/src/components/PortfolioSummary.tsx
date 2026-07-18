function PortfolioSummary({todayGain, totalGain, todayBestStock, totalBestStock, exchangeRate}: {todayGain: number, totalGain: number, todayBestStock: string, totalBestStock: string, exchangeRate: number }) {
    return (
        <div>
            <p>today gain: {(todayGain * exchangeRate).toFixed(4)}</p>
            <p>total gain: {(totalGain * exchangeRate).toFixed(4)}</p>
            <p>today best stock: {todayBestStock}</p>
            <p>total best stock: {totalBestStock}</p>
        </div>
    )

}

export default PortfolioSummary;