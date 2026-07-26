import {useNavigate} from "react-router-dom"
import ComboBox from "./ComboBox.tsx";

function StockList({stocksSymbols}: {stocksSymbols: string[]}) {
    const navigate = useNavigate();

    return (
        <div style={{overflowY: "auto", overflowX: "hidden", height: "90%"}}>
            <ComboBox options={stocksSymbols} onSelect={(result) => navigate(`/stock/${result}`)} alwaysShow={true}></ComboBox>
        </div>
    )
}

export default StockList;
