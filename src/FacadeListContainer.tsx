import React from "react";
import { FacadeData, getAllFacades } from "./ORM/DbOperations";
import { useGridContext } from "./context/GridContext";

export function FacadeListContainer() {

    const [facadeList, setFacadeList] = React.useState<FacadeData[]>([]);

    async function handleLoadFacade() {
        const facades = await getAllFacades();
        setFacadeList(facades);
    }

    return (
        <>
            {facadeList.length > 0 ? <div className="bg-gray-200 p-4 m-2 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Lista de Fachadas</h2>
                {Array.from(facadeList).map((facade, index) => {
                    const { rows, columns, useLetter, reverseVertical, reverseHorizontal, prefix, suffix, setGridOptions } = useGridContext();

                    return (
                        <div>
                            <h3 
                                onClick={ () => {
                                    setGridOptions({
                                        facadeName: facade.name,
                                        facadeId: facade.id,
                                        rows: facade.grid.rows,
                                        columns: facade.grid.columns,
                                        useLetter: facade.grid.useLetter,
                                        reverseVertical: facade.grid.reverseVertical,
                                        reverseHorizontal: facade.grid.reverseHorizontal,
                                        prefix: facade.grid.prefix,
                                        suffix: facade.grid.suffix
                                    });
                                }}
                            >{facade.name}</h3>
                        </div>
                    )
                })}

            </div> : <div>
                <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLoadFacade}>
                    Carregar Fachadas
                </button>
            </div>
            }
        </>
    )
}