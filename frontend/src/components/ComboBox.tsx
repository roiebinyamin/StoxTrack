import {useState, useRef, useEffect} from "react";
import Panel from "./Panel.tsx";

function ComboBox({options, onSelect, alwaysShow, currentOption}:{options: string[], onSelect: (result: string) => void, alwaysShow?: boolean, currentOption?: string}) {
    const [textWritten, setTextWritten] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false)

    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div style={{height:"90%", width:"100%"}} ref={boxRef}>
            <input
            type="text"
            placeholder={currentOption ? currentOption : ""}
            onClick={() => setIsOpen(true)}
            onChange={(e) => {setTextWritten((e.target.value).toUpperCase())}}
            />
            {(alwaysShow || isOpen) &&  (
                <div style={{height:"100%", width:"100%"}}>
                    {options.filter((option) => option.includes(textWritten)).map((option) => (
                        <Panel heightPer={"10%"} widthPer={"100%"} key={option} onClick={()=> {
                            onSelect(option)
                            setIsOpen(false)
                        }}>
                            {option}
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ComboBox;