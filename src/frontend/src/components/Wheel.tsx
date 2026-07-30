import {useState, useRef} from "react"

function Wheel({options, onSelect, isLoop}: {options: string[], onSelect: (result: string) => void, isLoop?: boolean}) {
    const [selectedOption, setSelectedOption] = useState<string>("")
    const boxRef = useRef<HTMLDivElement>(null);
    
    
    return (
        <div>

        </div>
    )
}

export default Wheel;