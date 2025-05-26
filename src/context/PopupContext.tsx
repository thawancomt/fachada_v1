import React, { createContext, useState } from "react";
import VALID_STATES from "../STATES/States";

type PopupData = {
    state: VALID_STATES;
    index: { x: number, y: number };
    dimension: { width: number, height: number };
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
    setDimension: React.Dispatch<React.SetStateAction<{ width: number, height: number }>>;
    setState: React.Dispatch<React.SetStateAction<VALID_STATES>>;
}

type PopupContextType = {
    isOpen: boolean;
    data: PopupData | null;
    openPopup: (data: PopupData) => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | null>(null)

function PopupProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<PopupData | null>(null);


    function openPopup(data: PopupData) {
        setData(data);
        setIsOpen(true);
    }

    function closePopup() {
        setIsOpen(false);
        setData(null);
    }

    return (
        <PopupContext.Provider value={{ isOpen, data, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    )
}


function usePopup() {
    const context = React.useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    } return context;
}

export { PopupProvider, usePopup };
export type { PopupData };