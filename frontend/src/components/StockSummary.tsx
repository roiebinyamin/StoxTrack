function StockSummary({todayGain}: {todayGain: number}) {
//function StockSummary({todayGain, totalGain}: {todayGain: number, totalGain: number}){
    return (
        <div>
            <p>today gain - {todayGain}</p>
        </div>
    )
}

export default StockSummary;