import Panel from "./Panel.tsx";

function getColorBasedOnGain(gain: number) {
    if (gain > 0) {
        return "#6ed65e";
    } else if (gain < 0) {
        return "#c7451e";
    } else {
        return "#807e7e";
    }
}

function PortfolioSummary({todayGain, totalGain, todayBestStock, totalBestStock, currentValue, exchangeRate}: {todayGain: number, totalGain: number, todayBestStock: string, totalBestStock: string, currentValue: number, exchangeRate: number }) {
    return (
        <Panel heightPer={"20%"} widthPer={"10%"} display={"grid"}>
            <div style={{display: "flex", justifyContent: "center", fontSize: "120%"}}>
                <u>current value: {(currentValue * exchangeRate).toFixed(4)}</u>
            </div>
            <div style={{display: "flex", justifyContent: "center", gap: "5%" , height: "100%", width: "100%"}}>
                <Panel heightPer={"80%"} widthPer={"40%"} color={getColorBasedOnGain(todayGain)}>
                    today gain: {(todayGain * exchangeRate).toFixed(4)}
                </Panel>
                <Panel heightPer={"80%"} widthPer={"40%"} color={getColorBasedOnGain(totalGain)}>
                    total gain: {(totalGain * exchangeRate).toFixed(4)}
                </Panel>
            </div>
            <div style={{display: "flex", justifyContent: "center" ,gap: "5%" , height: "100%", width: "100%"}}>
                <Panel heightPer={"80%"} widthPer={"40%"} color={"#807e7e"}>
                    today best stock: {todayBestStock}
                </Panel>
                <Panel heightPer={"80%"} widthPer={"40%"} color={"#807e7e"}>
                    total best stock: {totalBestStock}
                </Panel>
            </div>
        </Panel>
    )

}

export default PortfolioSummary;