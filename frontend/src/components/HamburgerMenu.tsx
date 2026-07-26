import {useState, useContext} from 'react';
import {CurrencyContext, LightModeContext} from "../App.tsx";
import ComboBox from "./ComboBox.tsx";

function HamburgerMenu() {
    const [showMenu, setShowMenu] = useState(false);

    const {currency, setCurrency} = useContext(CurrencyContext);
    const {lightMode, setLightMode} = useContext(LightModeContext);

    const currencies = ["USD", "ILS", "EUR", "GBP", "JPY"]

    return (
        <div>
            <div>
                <button onClick={() => setShowMenu(!showMenu)}>☰</button>
            </div>
            {showMenu && (
                <div>
                    <ComboBox options={currencies} onSelect={(result) => setCurrency(result)} currentOption={currency}/>
                    <button onClick={() => setLightMode(!lightMode)}>{lightMode ? "Dark Mode" : "Light Mode"}</button>
                </div>
            )}
        </div>
    )
}

export default HamburgerMenu;