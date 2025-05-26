import React, { useContext } from "react";


type GridOptions = {
    facadeName?: string;
    facadeId?: number;
    rows: number;
    columns: number;
    useLetter?: boolean;
    reverseVertical?: boolean;
    reverseHorizontal?: boolean;
    prefix?: string;
    suffix?: string;
};

type GridContextType = GridOptions & {
    setGridOptions: React.Dispatch<React.SetStateAction<GridOptions>>;
}


const GridContext = React.createContext<GridContextType | null>(null)

function GridProvider({children} : { children: React.ReactNode }) {
    const [gridOptions, setGridOptions] = React.useState<GridOptions>({
        facadeName: "",
        facadeId: 0,
        rows: 0,
        columns: 0,
        useLetter: false,
        reverseVertical: false,
        reverseHorizontal: false,
        prefix: "",
        suffix: ""
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