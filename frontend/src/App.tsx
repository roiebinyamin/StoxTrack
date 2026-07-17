import {Routes ,Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.tsx";
import StockPage from "./pages/StockPage.tsx";
import {createContext, useState} from "react";

interface CurrencyContextType {
    currency: string,
    setCurrency: (currency: string) => void
}

export const CurrencyContext = createContext<CurrencyContextType>({currency: "USD", setCurrency: () => {}})

function App() {
    const [currency, setCurrency] = useState("USD")
    return (
        <CurrencyContext.Provider value={{currency, setCurrency}}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stock/:symbol" element={<StockPage />} />
            </Routes>
        </CurrencyContext.Provider>
    )
}

export default App