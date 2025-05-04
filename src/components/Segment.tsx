import React, { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import Cookies from "js-cookie";
import NumberInput from "./NumberInput";

// Define valid states type and constant
type SegmentState = "finished" | "pending" | "error";
const VALID_STATES: SegmentState[] = ["finished", "pending", "error"];
const DEFAULT_STATE: SegmentState = "pending";

interface SegmentProps {
    index: string;
    corX?: number;
    corY?: number;
    allowEdit?: boolean;

    applyAllY?: (w: number, h: number) => void;
    applyAllX?: (w: number, h: number) => void;
}

// Helper function to create cookie keys safely
const getStateCookieKey = (x?: number, y?: number): string | null => {
    if (x === undefined || y === undefined) return null;
    return `segmentState:x${x}y${y}`; // Standardized key
};

const getNoteCookieKey = (x?: number, y?: number): string | null => {
    if (x === undefined || y === undefined) return null;
    return `segmentNote:x${x}y${y}`;
};

const getAreaCookieKey = (x?: number, y?: number): string | null => {
    if (x === undefined || y === undefined) return null;
    return `segmentArea:x${x}y${y}`;
}

const stateStyles: Record<SegmentState, string> = {
    finished: "bg-gradient-to-br from-green-400 to-green-400",
    pending: "bg-gradient-to-br from-yellow-300 to-yellow-300 ",
    error: "bg-gradient-to-br from-red-400 to-red-500",
};

function Segment({ index, corX, corY, applyAllY, applyAllX, allowEdit}: SegmentProps) {
    const stateCookieKey = getStateCookieKey(corX, corY);
    const noteCookieKey = getNoteCookieKey(corX, corY);
    const areaCookieKey = getAreaCookieKey(corX, corY);



    const getInitialState = useCallback((): SegmentState => {
        if (!stateCookieKey) return DEFAULT_STATE;
        const cookieState = Cookies.get(stateCookieKey);
        if (cookieState && VALID_STATES.includes(cookieState as SegmentState)) {
            return cookieState as SegmentState;
        }
        return DEFAULT_STATE;
    }, [stateCookieKey]);

    const getInitialNote = useCallback((): string => {
        if (!noteCookieKey) return "";
        return Cookies.get(noteCookieKey) || "";
    }, [noteCookieKey]);

    const getInitialArea = useCallback((): { width: number, height: number } | null => {

        if (!areaCookieKey) return null;

        const areaCookie = Cookies.get(areaCookieKey);

        if (areaCookie) {
            const parsedArea = JSON.parse(areaCookie);
            return { width: parsedArea.width || 0, height: parsedArea.height || 0 };
        }

        return null;

    }, [areaCookieKey]);




    const [segmentWidth, setWidth] = useState<number>(getInitialArea()?.width || 0);
    const [segmentHeight, setHeight] = useState<number>(getInitialArea()?.height || 0);
    const [currentState, setCurrentState] = useState<SegmentState>(getInitialState);
    const [note, setNote] = useState<string>(getInitialNote);

    const [applyY, setApplyY] = useState<boolean>(false);
    const [applyX, setApplyX] = useState<boolean>(false);


    const [showPopUp, setShowPopUp] = useState(false);


    const noteRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (showPopUp && noteRef.current) {
            noteRef.current.focus();
        }
    }, [showPopUp]);


    useEffect( () => {
        if (!allowEdit) {
            setShowPopUp(false);
        }
    }, [showPopUp])

    useEffect(() => {
        setCurrentState(getInitialState());
        setNote(getInitialNote());
    }, [corX, corY, getInitialState, getInitialNote,]);

    useEffect(() => {
        if ((corX !== undefined && corY !== undefined) && (segmentWidth > 0 && segmentHeight > 0)) {
            const area = { width: segmentWidth, height: segmentHeight };
            Cookies.set(areaCookieKey || "", JSON.stringify(area), { expires: 15 });
        }
    }, [segmentWidth, segmentHeight, areaCookieKey, corX, corY]);



    // --- Event Handlers ---
    // Function to update state and save to cookie
    const handleSetState = useCallback((newState: SegmentState) => {
        setCurrentState(newState);
        if (stateCookieKey) {
            Cookies.set(stateCookieKey, newState, { expires: 15 });
        } else {
            console.warn("Cannot save state: Coordinates are undefined.");
        }
    }, [stateCookieKey]); // Depend on the key

    // Function to save note to cookie and close popup
    const saveNoteAndClose = useCallback(() => {
        if (noteCookieKey) {
            Cookies.set(noteCookieKey, note, { expires: 15 });
        } else {
            console.warn("Cannot save note: Coordinates are undefined.");
        }
        setShowPopUp(false);
    }, [noteCookieKey, note]);




    const closePopup = useCallback(() => {
        setNote(getInitialNote());
        setShowPopUp(false);
    }, [getInitialNote]);

    const openPopup = useCallback(() => {
        // Only allow opening if coordinates are defined
        if (corX !== undefined && corY !== undefined) {
            setShowPopUp(true);
        } else {
            console.warn("Cannot open popup: Coordinates are undefined.");
            // Optionally provide user feedback here
        }
    }, [corX, corY]);




    const hasNote = note && note.trim().length > 0;

    return (
        <>
            <div
                className={`${stateStyles[currentState]}
                    flex items-center justify-center
                    cursor-pointer transition-all shadow-sm
                    hover:shadow-lg active:scale-100
                    rounded-lg aspect-square relative group`}
                onClick={openPopup}
                title={`Segment ${index} (State: ${currentState})${hasNote ? ' - Has Note' : ''}`}

                style={{ width: (segmentWidth > 50) ? `${segmentWidth / 10}px` : "300px", height: (segmentHeight && segmentHeight > 50) ? `${segmentHeight / 10}px` : "95px" }}
            >

                <section className="flex flex-col items-center">

                    <span className="text-white font-bold drop-shadow-md select-none">
                        {index}
                    </span>

                    <span className="text-black/60 font-semibold">{segmentWidth}x{segmentHeight}</span>
                </section>

                {/* Note Indicator */}
                {hasNote && (
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-blue-400 rounded-full ring-1 ring-white/80 shadow" title="Has note"></div>
                )}
            </div>

            {showPopUp && (
                <div
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
                                <span className="text-sm text-gray-500 ml-2">(X:{corX}, Y:{corY})</span>
                            )}
                        </h2>

                        <p className="text-sm font-medium text-gray-600 mb-2">Atual status:</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {(VALID_STATES).map(state => (
                                <button
                                    key={state}
                                    onClick={() => handleSetState(state)}
                                    className={`p-3 rounded-lg font-medium transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                                    ${currentState === state
                                            ? `${stateStyles[state]} text-white shadow-md ring-2 ring-black/20` // Active state style
                                            : `${state === "error" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800"} hover:bg-opacity-80
                                        ${state === "finished" ? "bg-green-200 text-green-800" : ""}
                                        ${state === "pending" ? "bg-yellow-200 text-yellow-800" : ""} // Inactive state style
                                        ` // Inactive state style
                                        }`
                                    }
                                >
                                    {state == "finished" ? "Concluído" : state == "pending" ? "Pendente" : "Incompleto"}
                                </button>
                            ))}
                        </div>


                        <div className="m-2 space-y-3 bg-black/5 p-4 overflow-hidden rounded-lg shadow-lg">
                            <label htmlFor="">Tamanho da Placa (milímetros)</label>
                            <section className="flex  *:rounded-lg">
                                <NumberInput value={segmentHeight} onChange={setHeight} label="Altura mm" />
                                <NumberInput value={segmentWidth} onChange={setWidth} label="Largura mm" />
                            </section>

                            <div className="grid grid-cols-2 gap-3 mb-6 text-center bg-gray-500 p-2 rounded-lg m-2">
                                <label htmlFor="">Aplicar em todo eixo Horizontal</label>
                                <input type="checkbox" onChange={ (e) => {
                                    setApplyX(e.target.checked);
                                }}/>

                                <label htmlFor="">Aplicar em todo eixo Vertical</label>
                                <input type="checkbox" onChange={(e) => setApplyY(e.target.checked)} />
                                
                                <button className="col-span-full w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    onClick={() => {
                                        if (applyX) {
                                            applyAllX && applyAllX(segmentWidth, segmentHeight);
                                        }
                                        if (applyY) {

                                            applyAllY && applyAllY(segmentWidth, segmentHeight);
                                        }
                                    }}

                                >Aplicar</button>
                            </div>

                        </div>




                        <div className="space-y-3">
                            <label htmlFor={`note-textarea-${index}-${corX}-${corY}`} className="block text-sm font-medium text-gray-700">
                                Observações da Placa:
                            </label>
                            <textarea
                                id={`note-textarea-${index}-${corX}-${corY}`} // Unique ID
                                ref={noteRef}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                                rows={4}
                                placeholder="Adicione notas importantes..."
                            />
                            <button
                                onClick={() => {
                                    saveNoteAndClose();
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Save Changes & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default React.memo(Segment);