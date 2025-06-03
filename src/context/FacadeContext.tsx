import React, { createContext, useCallback, useEffect } from "react";
import VALID_STATES from "../STATES/States";
import { updateSegment, SegmentData, getAllFacades, FacadeData } from "../ORM/DbOperations";

type SegmentCell = {
    state?: VALID_STATES,
    dimension?: { width: number, height: number },
    note?: string,
}

type FacadeContextOptions = {
    facadeId?: number,
    facadeName: string,

    data: {
        [row: number]: {
            [column: number]: SegmentCell
        }
    }

    createdAt?: Date,
    updatedAt?: Date,
}

type SideMenuOptions = {
    sideMenuOpen: boolean,
    setSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
    createNewFacadeMenu: boolean,
    setCreateNewFacadeMenu: React.Dispatch<React.SetStateAction<boolean>>,
    loadFacadeList: () => Promise<FacadeData[]>,
    facadeList: FacadeData[],
}

type FacadeContextType = FacadeContextOptions & {
    setFacadeOptions: React.Dispatch<React.SetStateAction<FacadeContextOptions>>
} & {
    updateSegmentDataInContext: (data: SegmentData) => Promise<void>
} & SideMenuOptions;

const FacadeContext = createContext<FacadeContextType | null>(null)

export default function FacadeProvider({ children }: { children: React.ReactNode }) {
    const [sideMenuOpen, setSideMenuOpen] = React.useState<boolean>(false);
    const [createNewFacadeMenu, setCreateNewFacadeMenu] = React.useState<boolean>(false);

    const [facadeList, setFacadeList] = React.useState<FacadeData[]>([]);

    const loadFacadeList = useCallback(async () => {
        const facades = await getAllFacades();

        setFacadeList(facades);

        return facades;
    }, []);


    const [facadeOptions, setFacadeOptions] = React.useState<FacadeContextOptions>({
        facadeId: 0,
        facadeName: "",
        data: { 0: { 0: {} } },
    })


    const updateSegmentDataInContext = useCallback(async (data: SegmentData) => {
        updateSegment({ ...data })

        setFacadeOptions(prev => {
            const newData = { ...prev.data }
            newData[data.index.x] = {
                ...newData[data.index.x],
                [data.index.y]: {
                    dimension: data.dimension,
                    state: data.state,
                    note: data.note
                }
            }
            return {
                ...prev,
                data: newData
            }
        })


    }, [])


    return (
        <FacadeContext.Provider value={{
            ...facadeOptions, setFacadeOptions, updateSegmentDataInContext, sideMenuOpen, setSideMenuOpen, createNewFacadeMenu, setCreateNewFacadeMenu, loadFacadeList, facadeList
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