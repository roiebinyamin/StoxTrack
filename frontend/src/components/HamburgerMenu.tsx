import {useState, useContext} from 'react';
import {CurrencyContext} from "../App.tsx";

function HamburgerMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const {currency, setCurrency} = useContext(CurrencyContext);

    const currencies = ["USD", "ILS", "EUR", "GBP", "JPY"]

    return (
        <div>
            <div>
                <button onClick={() => setShowMenu(!showMenu)}>☰</button>
            </div>
            {showMenu && (
                <div>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        {currencies.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}

export default HamburgerMenu;