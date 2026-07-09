import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

interface PortfolioPoint {
    date: string;
    value: number;
}

function PortfolioChart({data} : {data: PortfolioPoint[] }) {
    return (
        <div>
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