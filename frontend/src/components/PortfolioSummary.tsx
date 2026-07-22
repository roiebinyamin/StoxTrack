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

function PortfolioSummary({todayGain, totalGain, todayBestStock, totalBestStock, exchangeRate}: {todayGain: number, totalGain: number, todayBestStock: string, totalBestStock: string, exchangeRate: number }) {
    return (
        <Panel heightPer={"40%"} widthPer={"13%"}>
            <Panel heightPer={"20%"} widthPer={"40%"} color={getColorBasedOnGain(todayGain)}>
                today gain: {(todayGain * exchangeRate).toFixed(4)}
            </Panel>
            <Panel heightPer={"20%"} widthPer={"40%"} color={getColorBasedOnGain(totalGain)}>
                total gain: {(totalGain * exchangeRate).toFixed(4)}
            </Panel>
            <Panel heightPer={"20%"} widthPer={"40%"}>
                today best stock: {todayBestStock}
            </Panel>
            <Panel heightPer={"20%"} widthPer={"40%"}>
                total best stock: {totalBestStock}
            </Panel>
        </Panel>
    )

}

export default PortfolioSummary;