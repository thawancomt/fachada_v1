import React, { useContext } from "react";
import { SegmentCell, useFacadeContext } from "./FacadeContext";
import { updateFacade } from "../ORM/DbOperations";


type GridOptions = {
    rows: number;
    columns: number;
    useLetter?: boolean;
    reverseVertical?: boolean;
    reverseHorizontal?: boolean;
    gap?: number;
    prefix?: string;
    suffix?: string;

    [row: number]: {
        [column: number]: SegmentCell
    }
};

type GridContextType = GridOptions & {
    setGridOptions: React.Dispatch<React.SetStateAction<GridOptions>>;
} & {
    applyOnXaxis: (params: { dimension: { width: number, height: number }, index: { x: number, y: number } }) => void;
    applyOnYaxis: (params: { dimension: { width: number, height: number }, index: { x: number, y: number } }) => void;
}



const GridContext = React.createContext<GridContextType | null>(null)

function GridProvider({ children }: { children: React.ReactNode }) {

    const { facadeName, facadeId, data, createdAt, setFacadeOptions } = useFacadeContext();


    const [gridOptions, setGridOptions] = React.useState<GridOptions>({
        rows: 0,
        columns: 0,
        useLetter: false,
        reverseVertical: false,
        reverseHorizontal: false,
        prefix: "",
        suffix: "",
        gap: 1,

    });

    const applyOnYAxis = (params: { dimension: { width: number, height: number }, index: { x: number, y: number } }) => {
        // Apply the given dimension to all segments in the same column (Y axis), except the current row
        for (let i = 0; i < gridOptions.rows; i++) {

            if (data[i] && data[i][params.index.y]) {
                data[i][params.index.y].dimension = { ...params.dimension };
            } else {
                data[i] = {
                    ...data[i],
                    [params.index.y]: {
                        dimension: { ...params.dimension },
                        ...data[i]?.[params.index.y] // Preserve any existing properties
                    }
                }
            }
        }
        // Optionally, trigger a state update if needed
        setFacadeOptions(prev => ({
            ...prev,
            data: { ...data }
        }));
        updateFacade({
            id: facadeId,
            name: facadeName,
            grid: { ...gridOptions, ...data },
            createdAt: createdAt || new Date(),
            updatedAt: new Date()
        })
    }

    const applyOnXAxis = (params: { dimension: { width: number, height: number }, index: { x: number, y: number } }) => {
        // Apply the given dimension to all segments in the same row (X axis), except the current column
        for (let i = 0; i < gridOptions.columns; i++) {

            if (data[params.index.x] && data[params.index.x][i]) {
                data[params.index.x][i].dimension = { ...params.dimension };
            } else {
                data[params.index.x] = {
                      ...data[params.index.x],
                    [i]: {
                        dimension: { ...params.dimension },
                        ...data[params.index.x]?.[i] // Preserve any existing properties
                    }
                }
            }

            setFacadeOptions((prev) => {

                return {
                    ...prev,

                    data: { ...data}
                }
            })

            updateFacade({
                id: facadeId,
                name: facadeName,
                grid: { ...gridOptions, ...data },
                createdAt: createdAt || new Date(),
                updatedAt: new Date()
            })

        }

    }




    return (
        <GridContext.Provider value={{ ...gridOptions, setGridOptions, applyOnXaxis: applyOnXAxis, applyOnYaxis: applyOnYAxis }}>
            {children}
        </GridContext.Provider>
    );
}

export function useGridContext() {
    const context = useContext(GridContext);
    if (!context) {
        throw new Error("useGridContext must be used within a GridProvider");
    }
    return context;
}

export { GridProvider };
export type { GridOptions, GridContextType };