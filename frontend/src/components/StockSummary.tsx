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

function StockSummary({todayGain, totalGain, currentValue, exchangeRate}: {todayGain: number, totalGain: number, currentValue: number, exchangeRate: number}) {
    return (
        <Panel heightPer={"15%"} widthPer={"10%"} display={"grid"}>
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
        </Panel>
    )
}

export default StockSummary;