import React, { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import Cookies from "js-cookie";
import NumberInput from "./NumberInput";

import { createPortal } from "react-dom";

import {
    CheckIcon,
    TrashIcon,
    XMarkIcon

} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";

// Define valid states type and constant
type SegmentState = "finished" | "pending" | "error";
const VALID_STATES: SegmentState[] = ["finished", "pending", "error"];
const DEFAULT_STATE: SegmentState = "pending";

interface SegmentProps {
    index: string;
    corX?: number;
    corY?: number;
    allowEdit?: boolean;

}



function Segment({ index, corX, corY, allowEdit }: SegmentProps) {

    const [showPopUp, setShowPopUp] = useState(false);


    const noteRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (showPopUp && noteRef.current) {
            noteRef.current.focus();
        }
    }, [showPopUp]);




    const closePopup = useCallback(() => {
        setShowPopUp(false);
    }, []);

    const openPopup = useCallback(() => {
        // Only allow opening if coordinates are defined
        if (corX !== undefined && corY !== undefined) {
            setShowPopUp(true);
        } else {
            console.warn("Cannot open popup: Coordinates are undefined.");
        }
    }, [corX, corY]);





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

            <h2 className="text-xl font-semibold text-gray-800 mb-5 pr-8">
                Editar Placa <span className="text-blue-600 font-bold">#{index}</span>
                {corX !== undefined && corY !== undefined && (
                    <span className="text-sm text-gray-500 ml-2">(colocar cordenadas aqui)</span>
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
                    <NumberInput label="Altura mm" />
                    <NumberInput label="Largura mm" />
                </section>

            </div>




            <div className="space-y-3">
                <label htmlFor={`note-textarea-${index}-${corX}-${corY}`} className="block text-sm font-medium text-gray-700">
                    Observações da Placa:
                </label>
                <textarea
                    id={`note-textarea-${index}-${corX}-${corY}`} // Unique ID
                    ref={noteRef}
                    value={""}
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

    const [state, setState] = useState("")

    return (
        <>
            <div
                className={` ${state || "bg-gray-700"}
                    flex items-center justify-center
                    cursor-pointer transition-all shadow-sm
                    hover:shadow-lg active:scale-100
                    duration-1000
                    rounded-lg aspect-square relative group`}
                onClick={openPopup}
            >

                <section className="flex flex-col items-center">

                    <span className="text-white font-bold drop-shadow-md select-none">
                        {index}
                    </span>
                    <span className="text-black/60 font-semibold">Tamanho aquid</span>
                </section>
                <motion.div

                    className="absolute top-1/2 translate-y-20 transform-gpu flex gap-2  z-50 ">
                    <motion.div
                        initial={{ opacity: 0, translateY: 0 }}
                        animate={{ opacity: 1, translateY: -20 }}

                        whileHover={{ rotateZ: 2, scale: 1.2 }}
                        whileTap={{ translateY: 0 }}
                    >

                        <CheckIcon className="text-white w-8 h-8 " onMouseEnter={() => setState("bg-green-500")} onMouseLeave={() => setState("")} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, translateY: 0 }}
                        animate={{ opacity: 1, translateY: -20 }}

                        whileHover={{ rotateZ: 2, scale: 1.4 }}
                        whileTap={{ translateY: 0 }}>

                        <XMarkIcon className="text-white w-8 h-8" onMouseEnter={() => setState("bg-red-400")} onMouseLeave={() => setState("")} />
                    </motion.div>
                </motion.div>



            </div>

            {(showPopUp && allowEdit) && (
                createPortal(popupContainer, document.body) // Use createPortal to render the popup in the body
            )}
        </>
    );
}

export default React.memo(Segment);