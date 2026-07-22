import {LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer} from "recharts";
import {useState} from "react";
import {ONE_DAY} from "../../../src/backend/constants.ts";
import Panel from "./Panel.tsx";

interface PortfolioPoint {
    date: string;
    value: number;
}

function PortfolioChart({data, onRangeChange, firstDate, exchangeRate} : {data: PortfolioPoint[], onRangeChange: (startDate: string, endDate: string) => void, firstDate: string, exchangeRate: number }) {
    const [showCustomDatesForm, setShowCustomDatesForm] = useState(false)

    const [customFirstDate, setCustomFirstDate] = useState<string>(firstDate)
    const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().slice(0,10))

    const todayDate = new Date().toISOString().slice(0, 10);

    function getClampedStartDate(wantedDate: string){
        if (new Date(firstDate) > new Date(wantedDate))
            return firstDate
        else
            return wantedDate
    }

    const convertedData = data.map(d =>({ ...d, value: (d.value * exchangeRate)}))

    return (
        <Panel heightPer={"80%"} widthPer={"90%"}>
            <div style={{display: "flex", justifyContent: "center", height: "100%", width: "100%"}}>
                <ResponsiveContainer height="100%" width="100%" initialDimension={{ width: 1, height: 1 }}>
                    <LineChart data={convertedData}>
                        <XAxis dataKey="date"/>
                        <YAxis dataKey="value" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={x => x.toFixed(4)}/>
                        <Tooltip formatter={(value) => typeof value === "number" ? value.toFixed(4) : value} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" color={"red"}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(Date.now()).toISOString().slice(0, 10)),todayDate)
            }}>Day</button>

            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(Date.now() - 7 * ONE_DAY).toISOString().slice(0,10)), todayDate)
            }}>Week</button>

            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString().slice(0,10)), todayDate)
            }}>Month</button>

            <button onClick={()=> {
                onRangeChange(getClampedStartDate(new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0,10)), todayDate)
            }}>6 Month</button>

            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10)), todayDate)
            }}>YTD</button>

            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(Date.now() - 365 * ONE_DAY).toISOString().slice(0,10)), todayDate)
            }}>1 Year</button>

            <button onClick={() => {
                    onRangeChange(getClampedStartDate(new Date(Date.now() - 5 * 365 * ONE_DAY).toISOString().slice(0,10)), todayDate)
            }}>5 Year</button>

            <button onClick={() => {
                if (firstDate) {
                    onRangeChange(firstDate, new Date().toISOString().slice(0, 10))}}}>MAX</button>

            <button onClick={() => {setShowCustomDatesForm(!showCustomDatesForm)}}>Custom</button>
            {showCustomDatesForm && (
                <div>
                    <input
                        type="date"
                        placeholder="First date"
                        value={customFirstDate}
                        onChange={(e) => setCustomFirstDate(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="End date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                    <button onClick={() => {
                        setShowCustomDatesForm(!showCustomDatesForm)
                        setCustomFirstDate("")
                        setCustomEndDate("")
                        if (customFirstDate > customEndDate) {
                            console.log("First date cannot be after end date")
                        }
                        if (new Date(firstDate) > new Date(customFirstDate))
                            onRangeChange(firstDate, customEndDate)
                        else
                            onRangeChange(customFirstDate, customEndDate)}}>Confirm</button>
                </div>
            )}
        </Panel>
    )
}

export default PortfolioChart