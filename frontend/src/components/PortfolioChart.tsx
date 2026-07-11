import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import {useState} from "react";

interface PortfolioPoint {
    date: string;
    value: number;
}

function PortfolioChart({data, onRangeChange, firstDate} : {data: PortfolioPoint[], onRangeChange: (startDate: string, endDate: string) => void, firstDate: string }) {
    const [showCustomDatesForm, setShowCustomDatesForm] = useState(false)

    const [customFirstDate, setCustomFirstDate] = useState<string>(firstDate)
    const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().slice(0,10))

    return (
        <div>
            <button onClick={() => {onRangeChange(new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0,10))}}>Today</button>

            <button onClick={() => {onRangeChange(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), new Date().toISOString().slice(0,10))}}>Week</button>

            <button onClick={() => {onRangeChange(new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString().slice(0,10), new Date().toISOString().slice(0,10))}}>Month</button>

            <button onClick={() => {onRangeChange(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10), new Date().toISOString().slice(0, 10))}}>YTD</button>

            <button onClick={() => {onRangeChange(new Date(Date.now() - 365 * 24 *60 * 60 *1000).toISOString().slice(0,10), new Date().toISOString().slice(0, 10))}}>1 Year</button>

            <button onClick={() => {onRangeChange(new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0,10), new Date().toISOString().slice(0, 10))}}>5 Year</button>

            <button onClick={() => {onRangeChange(firstDate, new Date().toISOString().slice(0, 10))}}>MAX</button>

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
                    <button onClick={() => {onRangeChange(customFirstDate, customEndDate)}}>Confirm</button>
                </div>
            )}

            <LineChart width={500} height={300} data={data}>
                <CartesianGrid />
                <XAxis dataKey="date"/>
                <YAxis dataKey="value"/>
                <Tooltip/>
                <Line type="monotone" dataKey="value" stroke="#8884d8"/>
            </LineChart>
        </div>
    )
}

export default PortfolioChart