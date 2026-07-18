import {Routes ,Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.tsx";
import StockPage from "./pages/StockPage.tsx";
import {createContext, useState} from "react";
import HamburgerMenu from "./components/HamburgerMenu.tsx";

interface CurrencyContextType {
    currency: string,
    setCurrency: (currency: string) => void
}

interface LightModeType {
    lightMode: boolean,
    setLightMode: (lightMode: boolean) => void
}

export const CurrencyContext = createContext<CurrencyContextType>({currency: "USD", setCurrency: () => {}})

export const LightModeContext = createContext<LightModeType>({lightMode: false, setLightMode: () => {}})

function App() {
    const [currency, setCurrency] = useState("USD")
    const [lightMode, setLightMode] = useState(false)
    return (
        <CurrencyContext.Provider value={{currency, setCurrency}}>
            <LightModeContext.Provider value={{lightMode, setLightMode}}>
                <HamburgerMenu/>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/stock/:symbol" element={<StockPage />} />
                </Routes>
            </LightModeContext.Provider>
        </CurrencyContext.Provider>
    )
}

export default App