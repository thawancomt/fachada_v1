import React from "react";
import { saveFacade } from "./ORM/DbOperations";

export function CreateFacadePopup({isOpen, setIsOpen}: {isOpen: boolean | undefined, setIsOpen: (value: boolean) => void}) {

    const [facadeName, setFacadeName] = React.useState("");
    const [gridRows, setGridRows] = React.useState(2);
    const [gridColumns, setGridColumns] = React.useState(5);
    const [reverseVertical, setReverseVertical] = React.useState(false);
    const [reverseHorizontal, setReverseHorizontal] = React.useState(false);
    const [useLetter, setUseLetter] = React.useState(false);
    const [prefix, setPrefix] = React.useState("");
    const [suffix, setSuffix] = React.useState("");

    function handleSave() {
        saveFacade(
            {
                name: facadeName,
                grid: {
                    rows: gridRows,
                    columns: gridColumns,
                    useLetter: useLetter,
                    reverseVertical: reverseVertical,
                    reverseHorizontal: reverseHorizontal,
                    prefix: prefix,
                    suffix: suffix
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        )
    }

    return (
        <>
            {isOpen && <div className="bg-gray-950/90 fixed inset-0 flex items-center justify-center" 
                onClick={(e) => {
                    console.log("Clicked outside to close popup");
                    setIsOpen(false);
                }}>
                <div className="bg-white z-50 p-4 rounded-2xl flex flex-col" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <label htmlFor="">Nome da fachada</label>
                    <input type="text" className="input-control-v1" name="" id="" value={facadeName} onChange={(e) => setFacadeName(e.target.value)} />

                    <label htmlFor="">Linhas e Colunas</label>
                    <div>
                        <label htmlFor="">Linhas</label>
                        <input type="number" className="input-control-v1" name="" id="" placeholder="Linhas" value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} />

                        <label htmlFor="">Colunas</label>
                        <input type="number" className="input-control-v1" name="" id="" placeholder="Colunas" value={gridColumns} onChange={(e) => setGridColumns(Number(e.target.value))} />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="">Usar letras</label>
                        <input type="checkbox" checked={useLetter} onChange={(e) => setUseLetter(e.target.checked)} />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="">Inverter vertical</label>
                        <input type="checkbox" checked={reverseVertical} onChange={(e) => setReverseVertical(e.target.checked)} />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="">Inverter horizontal</label>
                        <input type="checkbox" checked={reverseHorizontal} onChange={(e) => setReverseHorizontal(e.target.checked)} />
                    </div>

                    <label htmlFor="">Prefixo</label>
                    <input type="text" className="input-control-v1" name="" id="" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                    <label htmlFor="">Sufixo</label>
                    <input type="text" className="input-control-v1" name="" id="" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                    <button className="bg-blue-500 text-white p-2 rounded mt-2" onClick={() => {
                        console.log("Saving...");
                        handleSave();
                        setIsOpen(false);
                    }}>Save</button>
                </div>
            </div>}
        </>
    )
}