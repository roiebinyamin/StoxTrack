import {useState, useContext} from 'react';
import {CurrencyContext, LightModeContext} from "../App.tsx";
import ComboBox from "./ComboBox.tsx";
import PopOutMenu from "./PopOutMenu.tsx";

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
                <PopOutMenu onClose={() => setShowMenu(false)}>
                    <ComboBox options={currencies} onSelect={(result) => setCurrency(result)} currentOption={currency}/>
                    <button onClick={() => setLightMode(!lightMode)}>{lightMode ? "Dark Mode" : "Light Mode"}</button>
                </PopOutMenu>
            )}
        </div>
    )
}

export default HamburgerMenu;