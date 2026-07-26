import  {useContext ,type ReactNode} from 'react';
import {LightModeContext} from "../App.tsx";

function Panel({children, heightPer, widthPer, color, display, onClick}: {children: ReactNode, heightPer: string, widthPer: string, color?: string, display?: string, onClick?: () => void}) {
    const lightMode = useContext(LightModeContext);

    if (!lightMode.lightMode) {
        return (
            <div style={{
                height: heightPer,
                width: widthPer,
                backgroundColor: color? color : "#212121",
                borderRadius: "1%",
                padding: "1%",
                borderColor: "#1e1e1f",
                borderStyle: "solid",
                display: display? display : "",
            }} onClick={onClick}>
                {children}
            </div>
        )
    }

    else {
        return (
            <div style={{
                height: heightPer,
                width: widthPer,
                backgroundColor: color? color : "#d0d3d6",
                borderRadius: "1%",
                padding: "1%",
                borderColor: "#c2c4c6",
                borderStyle: "solid",
                display: display? display : "",
            }} onClick={onClick}>
                {children}
            </div>
        )
    }
}

export default Panel;