import Panel from "./Panel.tsx";
import {TO_FIXED_NUM} from "../../../src/backend/constants.ts";

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
        <Panel heightPer={"25%"} widthPer={"100%"} display={"grid"}>
            <div style={{display: "flex", justifyContent: "center", fontSize: "120%"}}>
                <u>current value: {(currentValue * exchangeRate).toFixed(TO_FIXED_NUM)}</u>
            </div>
            <div style={{display: "flex", justifyContent: "center", gap: "5%" , height: "100%", width: "100%"}}>
                <Panel heightPer={"83%"} widthPer={"45%"} color={getColorBasedOnGain(todayGain)}>
                    today gain: {(todayGain * exchangeRate).toFixed(TO_FIXED_NUM)}
                </Panel>
                <Panel heightPer={"83%"} widthPer={"45%"} color={getColorBasedOnGain(totalGain)}>
                    total gain: {(totalGain * exchangeRate).toFixed(TO_FIXED_NUM)}
                </Panel>
            </div>
            <div style={{display: "flex", justifyContent: "center" ,gap: "5%" , height: "100%", width: "100%"}}>
                <Panel heightPer={"83%"} widthPer={"45%"} color={"#807e7e"}>
                    today best stock: {todayBestStock}
                </Panel>
                <Panel heightPer={"83%"} widthPer={"45%"} color={"#807e7e"}>
                    total best stock: {totalBestStock}
                </Panel>
            </div>
        </Panel>
    )

}

export default PortfolioSummary;