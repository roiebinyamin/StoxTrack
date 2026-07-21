import  {useContext ,type ReactNode} from 'react';
import {LightModeContext} from "../App.tsx";

function Panel({children, heightPer, widthPer}: {children: ReactNode, heightPer: string, widthPer: string}) {
    const lightMode = useContext(LightModeContext);

    if (!lightMode.lightMode) {
        return (
            <div style={{
                height: heightPer,
                width: widthPer,
                backgroundColor: "#212121",
                borderRadius: "1%",
                padding: "1%"
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
                padding: "1%"
            }}>
                {children}
            </div>
        )
    }
}

export default Panel;