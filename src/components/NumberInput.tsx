

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
}

function NumberInput({ value, onChange, label}: NumberInputProps) {

    function CleanNumber(value: number) {
        const raw = String(value).replace(/^0+/, '');
        const number = Number(raw);
        return isNaN(number) ? 0 : number;
    }

    return (
        <div className={`${label ? "!w-full" : " items-start"} flex flex-col items-center`}>
            <input
                type="text"
                inputMode="numeric"
                value={CleanNumber(value)}
                onChange={(e) => { onChange(CleanNumber(Number(e.target.value))) }}
                placeholder="0"
                className="input-control-v1 w-1/2 min-w-fit text-center m-2"
            />
            {label && <span className="text-sm text-gray-500">{label}</span>}
        </div>
    );
}

export default NumberInput;