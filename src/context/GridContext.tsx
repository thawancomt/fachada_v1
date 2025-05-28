import React, { useContext } from "react";
import { SegmentCell } from "./FacadeContext";


type GridOptions = {
    rows: number;
    columns: number;
    useLetter?: boolean;
    reverseVertical?: boolean;
    reverseHorizontal?: boolean;
    prefix?: string;
    suffix?: string;

    [row: number] : {
        [column: number] : SegmentCell
    }
};

type GridContextType = GridOptions & {
    setGridOptions: React.Dispatch<React.SetStateAction<GridOptions>>;
}


const GridContext = React.createContext<GridContextType | null>(null)

function GridProvider({children} : { children: React.ReactNode }) {
    const [gridOptions, setGridOptions] = React.useState<GridOptions>({
        rows: 0,
        columns: 0,
        useLetter: false,
        reverseVertical: false,
        reverseHorizontal: false,
        prefix: "",
        suffix: "",
    });

    return (
        <GridContext.Provider value={{ ...gridOptions, setGridOptions }}>
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