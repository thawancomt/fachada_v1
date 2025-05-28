import React, { createContext } from "react";
import VALID_STATES from "../STATES/States";

type SegmentCell = {
    state?: VALID_STATES,
    dimension?: { width: number, height: number },
    note?: string,	
}

type FacadeContextOptions = {
    facadeId: number,
    facadeName: string,
    
    data: {
        [row: number]: {
            [column: number]: SegmentCell
        }
    }
}

type FacadeContextType = FacadeContextOptions & {
    setFacadeOptions: React.Dispatch<React.SetStateAction<FacadeContextOptions>>
}

const FacadeContext = createContext<FacadeContextType|null>(null)

export default function FacadeProvider({children} : { children : React.ReactNode}) {

    const [facadeOptions, setFacadeOptions] = React.useState<FacadeContextOptions>({
        facadeId: 0,
        facadeName: "",
        data: { 0: { 0: {} }}
    })

    return (
        <FacadeContext.Provider value={{
            ...facadeOptions, setFacadeOptions
        }}>
            {children}
        </FacadeContext.Provider>
    )
}

function useFacadeContext() {
    const context = React.useContext(FacadeContext);
    if (!context) {
        throw new Error("useFacadeContext must be used within a FacadeProvider");
    }
    return context;
}

export { FacadeProvider, useFacadeContext };
export type { FacadeContextOptions, FacadeContextType, SegmentCell };