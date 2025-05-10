import React, { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import Cookies from "js-cookie";
import NumberInput from "./NumberInput";
import { dbManager } from "./utils/dbManager";

import { createPortal } from "react-dom";

import {
    CheckIcon,
    XMarkIcon

} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";


type SegmentState = "finished" | "pending" | "error";
const VALID_STATES: SegmentState[] = ["finished", "pending", "error"];
const DEFAULT_STATE: SegmentState = "pending";
const stateStyles: Record<SegmentState, string> = {
    finished: "bg-green-500",
    pending: "bg-yellow-500",
    error: "bg-red-500",
};

interface SegmentProps {
    index: { x: number; y: number };
    gridRepresentation: string;
    allowEdit?: boolean;
    facadeName: string;

}

function Segment({ index, allowEdit, gridRepresentation, facadeName }: SegmentProps) {

    const [showPopUp, setShowPopUp] = useState(false);


    const noteRef = useRef<HTMLTextAreaElement>(null);

    const closePopup = useCallback(() => {
        setShowPopUp(false);
    }, []);

    const openPopup = useCallback(() => {
        if (index.x !== undefined && index.y !== undefined) {
            setShowPopUp(true);
        } else {
            console.warn("Cannot open popup: Coordinates are undefined.");
        }
    }, [index.x, index.y]);

    const [state, setState] = useState(dbManager.getSegmentState(facadeName, { x: index.x, y: index.y }) || DEFAULT_STATE);
    const [segmenteNote, setSegmentNote] = useState(dbManager.getSegmentNote(facadeName, { x: index.x, y: index.y }) || "");
    const [{ width, height }, setSize] = useState(dbManager.getSegmentArea(facadeName, { x: index.x, y: index.y }) || { width: 0, height: 0 });

    useEffect(() => {
        dbManager.setSegmentState(facadeName, { x: index.x, y: index.y }, state || DEFAULT_STATE);
    }, [state]);

    useEffect(() => {
        dbManager.setSegmentNote(facadeName, { x: index.x, y: index.y }, segmenteNote)
    }, [segmenteNote]);

    useEffect(() => {
        dbManager.setSegmentArea(facadeName, { x: index.x, y: index.y }, { width, height })
    }, [width, height]);

    useEffect(() => {
        setState(dbManager.getSegmentState(facadeName, { x: index.x, y: index.y }) || DEFAULT_STATE)
        setSegmentNote(dbManager.getSegmentNote(facadeName, { x: index.x, y: index.y }) || "")
        setSize(dbManager.getSegmentArea(facadeName, { x: index.x, y: index.y }) || { width: 0, height: 0 })

    }, [facadeName, index.x, index.y])

    const popupContainer = <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"

        onClick={closePopup}
    >
        <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in"
            onClick={(e) => {
                e.stopPropagation();

            }}
        >
            <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Close popup"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <section>
                <h1 className="text-2xl text-blue-600 my-2 font-semibold">{facadeName}</h1>
            </section>

            <h2 className="text-xl font-semibold text-gray-800 mb-5 pr-8">
                Editar Placa <span className="text-blue-600 font-bold">#{""}</span>
                {index.x !== undefined && index.y !== undefined && (
                    <span className="text-sm text-gray-500 ml-2">{gridRepresentation}</span>
                )}
            </h2>

            <p className="text-sm font-medium text-gray-600 mb-2">Atual status:</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {(VALID_STATES).map(state => (
                    <button
                        key={state}
                        className={`p-3 rounded-lg font-medium transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 bg-amber-300`}
                    //             ${currentState === state
                    //         ? `${stateStyles[state]} text-white shadow-md ring-2 ring-black/20` // Active state style
                    //         : `${state === "error" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800"} hover:bg-opacity-80
                    //                 ${state === "finished" ? "bg-green-200 text-green-800" : ""}
                    //                 ${state === "pending" ? "bg-yellow-200 text-yellow-800" : ""} // Inactive state style
                    //                 ` // Inactive state style
                    //     }`}
                    >
                        {state == "finished" ? "Concluído" : state == "pending" ? "Pendente" : "Incompleto"}
                    </button>
                ))}
            </div>


            <div className="m-2 space-y-3 bg-black/5 p-4 overflow-hidden rounded-lg shadow-lg">
                <label htmlFor="">Tamanho da Placa (milímetros)</label>
                <section className="flex  *:rounded-lg">
                    <NumberInput label="largura mm" value={width} onChange={(value) => setSize(prev => ({ ...prev, width: value }))} />
                    <NumberInput label="altura mm" value={height} onChange={(value) => setSize(prev => ({ ...prev, height: value }))} />
                </section>

            </div>




            <div className="space-y-3">
                <label htmlFor={`note-textarea-${index}-${index.x}-${index.y}`} className="block text-sm font-medium text-gray-700">
                    Observações da Placa:
                </label>
                <textarea
                    id={`note-textarea-${index}-${index.x}-${index.y}`} // Unique ID
                    ref={noteRef}
                    value={segmenteNote}
                    onChange={(e) => setSegmentNote(e.target.value)} // Update state on change
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                    rows={4}
                    placeholder="Adicione notas importantes..." />
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    Save Changes & Close
                </button>
            </div>
        </div>
    </div>;



    return (
        <>
            <div
                className={` ${stateStyles[state]}
                    flex items-center justify-center
                    cursor-pointer transition-all shadow-sm
                    hover:shadow-lg active:scale-100
                    duration-1000
                    rounded-lg aspect-square relative group`}
                onClick={openPopup}

                style={{
                    width: width && width > 500 ? `${width / 10}px` : "auto",
                    height: height && height > 500 ? `${height / 10}px` : "auto",
                }}
            >

                <section className="flex flex-col items-center">

                    <span className="text-white font-bold drop-shadow-md select-none">
                        {gridRepresentation}
                    </span>
                    <span className="text-black/60 font-semibold text-nowrap">{width && height ? `${width}mm x ${height}mm` : "0x0"}</span>
                </section>
                <motion.div

                    className=" transform-gpu flex gap-2  z-50 ">
                    <motion.div
                        initial={{ opacity: 0, translateY: 0 }}
                        animate={{ opacity: 1, translateY: -20 }}

                        whileHover={{ rotateZ: 2, scale: 1.2 }}
                        whileTap={{ translateY: 0 }}
                    >

                        <CheckIcon className="text-green-500 w-8 h-8 border"
                            onClick={(e) => {
                                e.stopPropagation(); // 
                                setState("finished")
                            }}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, translateY: 0 }}
                        animate={{ opacity: 1, translateY: -20 }}

                        whileHover={{ rotateZ: 2, scale: 1.4 }}
                        whileTap={{ translateY: 0 }}>

                        <XMarkIcon className="text-red-500 w-8 h-8"
                            onClick={(e) => {
                                e.stopPropagation(); //
                                setState("error")
                            }}
                        />
                    </motion.div>
                </motion.div>



            </div>

            {(showPopUp && allowEdit) && (
                createPortal(popupContainer, document.body) // Use createPortal to render the popup in the body
            )}
        </>
    );
}

export default Segment;
export type { SegmentState };
export { VALID_STATES, DEFAULT_STATE, stateStyles };