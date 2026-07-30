import {useEffect ,type ReactNode} from 'react';

function PopOutMenu({children, onClose}: {children: ReactNode, onClose: () => void}) {

    useEffect(() => {
        function handleEscClick(event: KeyboardEvent){
            if (event.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("keydown", handleEscClick);
        return () => {
            document.removeEventListener("keydown", handleEscClick);
        }
    }, []);

    return (
        <div>
            <div style={{position:"fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "1000"}} onClick={()=> onClose()}></div>
            <div style={{position:"fixed", zIndex: "1001"}}>{children}</div>
        </div>
    )
}

export default PopOutMenu;