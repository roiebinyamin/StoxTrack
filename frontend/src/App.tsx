import {Routes ,Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.tsx";
import StockPage from "./pages/StockPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock/:symbol" element={<StockPage />} />
        </Routes>
    )
}

export default App