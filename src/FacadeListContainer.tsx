import React from "react";
import { FacadeData, getAllFacades } from "./ORM/DbOperations";
import { useFacadeContext } from "./context/FacadeContext";
import { useGridContext } from "./context/GridContext";
import FacadeListItem from "./smallComponents/FacadeListItem";

export function FacadeListContainer() {

    const [facadeList, setFacadeList] = React.useState<FacadeData[]>([]);

    async function handleLoadFacade() {
        const facades = await getAllFacades();
        setFacadeList(facades);
    }

    const { setFacadeOptions } = useFacadeContext();
    const { setGridOptions } = useGridContext();

    React.useEffect(() => {
        handleLoadFacade();
    }, []);

    function handleClick(facade: FacadeData) {
        setGridOptions({
            rows: facade.grid.rows,
            columns: facade.grid.columns,
            useLetter: facade.grid.useLetter,
            reverseVertical: facade.grid.reverseVertical,     
            reverseHorizontal: facade.grid.reverseHorizontal,
            prefix: facade.grid.prefix,
            suffix: facade.grid.suffix,
        });
        setFacadeOptions({
            facadeId: facade.id,
            facadeName: facade.name,
            data: facade.grid,
        })
    }

    return (
        <div className="bg-gray-200 p-4 m-2 rounded shadow-lg">
            <section>
                <h2 className="text-xl font-bold mb-4">Lista de Fachadas</h2>
                <span className="font-medium">Selecione uma das fachadas</span>
            </section>
            <ol>

                {Array.from(facadeList).map((facade, index) => {


                    return (
                        <FacadeListItem key={index} facadeName={facade.name} grid={facade.grid}
                            onClick={() => {
                                handleClick(facade);
                            }} />
                    )
                })}
            </ol>
        </div>
    )
}