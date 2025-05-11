

interface NumberInputProps {
    value?: number;
    onChange?: (value: number) => void;
    label?: string;
    max?: number;
    min?: number;
}

function NumberInput({ value, onChange, label, max, min}: NumberInputProps) {

    function CleanNumber(value: number) {
        const raw = String(value).replace(/^0+/, '');
        const number = Number(raw);
        return isNaN(number) ? 0 : number;
    }

    function changeValue(value : string) {
        if (max !== undefined && Number(value) > max) {
            value = String(max);
        }
        if (min !== undefined && Number(value) < min) {
            value = String(min);
        }
        onChange && onChange(CleanNumber(Number(value))) 
    }

    return (
        <div className={`${label ? "!w-full" : " items-start"} flex flex-col items-center`}>
            <input
                type="number"
                inputMode="numeric"
                value={CleanNumber(value || 0)}
                onChange={(e) => { changeValue(e.target.value) }}
                placeholder="0"
                className="input-control-v1 w-1/2 min-w-fit text-center m-2"
            />
            {label && <span className="text-sm text-gray-500">{label}</span>}
        </div>
    );
}

export default NumberInput;