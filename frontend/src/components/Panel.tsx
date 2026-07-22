import  {useContext ,type ReactNode} from 'react';
import {LightModeContext} from "../App.tsx";

function Panel({children, heightPer, widthPer, color}: {children: ReactNode, heightPer: string, widthPer: string, color?: string}) {
    const lightMode = useContext(LightModeContext);

    if (!lightMode.lightMode) {
        return (
            <div style={{
                height: heightPer,
                width: widthPer,
                backgroundColor: color? color : "#212121",
                borderRadius: "1%",
                padding: "0.25%",
                borderColor: "#1e1e1f",
                borderStyle: "solid",

            }}>
                {children}
            </div>
        )
    }

    if (lightMode.lightMode) {
        return (
            <div style={{
                height: heightPer,
                width: widthPer,
                backgroundColor: "#d0d3d6",
                borderRadius: "1%",
                padding: "1%",
                borderColor: "#c2c4c6",
                borderStyle: "solid"
            }}>
                {children}
            </div>
        )
    }
}

export default Panel;