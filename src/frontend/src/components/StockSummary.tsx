import Panel from "./Panel.tsx";
import {TO_FIXED_NUM} from "../../../backend/constants.ts";

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
                <u>current value: {(currentValue * exchangeRate).toFixed(TO_FIXED_NUM)}</u>
            </div>
            <div style={{display: "flex", justifyContent: "center", gap: "5%" , height: "100%", width: "100%"}}>
                <Panel heightPer={"80%"} widthPer={"40%"} color={getColorBasedOnGain(todayGain)}>
                    today gain: {(todayGain * exchangeRate).toFixed(TO_FIXED_NUM)}
                </Panel>
                <Panel heightPer={"80%"} widthPer={"40%"} color={getColorBasedOnGain(totalGain)}>
                    total gain: {(totalGain * exchangeRate).toFixed(TO_FIXED_NUM)}
                </Panel>
            </div>
        </Panel>
    )
}

export default StockSummary;