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

function StockSummary({todayGain, totalGain, exchangeRate}: {todayGain: number, totalGain: number, exchangeRate: number}) {
    return (
        <Panel heightPer={"20%"} widthPer={"18%"}>
            <Panel heightPer={"20%"} widthPer={"40%"} color = {getColorBasedOnGain(todayGain)}>
                today gain: {(todayGain * exchangeRate).toFixed(4)}
            </Panel>
            <Panel heightPer={"20%"} widthPer={"40%"} color={getColorBasedOnGain(totalGain)}>
                total gain: {(totalGain * exchangeRate).toFixed(4)}
            </Panel>
        </Panel>
    )
}

export default StockSummary;