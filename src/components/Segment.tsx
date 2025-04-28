import React, { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import Cookies from "js-cookie";

// Define valid states type and constant
type SegmentState = "finished" | "pending" | "error";
const VALID_STATES: SegmentState[] = ["finished", "pending", "error"];
const DEFAULT_STATE: SegmentState = "pending";

interface SegmentProps {
    index: string;
    corX?: number; // Keep optional
    corY?: number; // Keep optional
    // actualState is removed - state is primarily driven by cookies or default
}

// Helper function to create cookie keys safely
const getStateCookieKey = (x?: number, y?: number): string | null => {
    if (x === undefined || y === undefined) return null;
    return `segmentState:x${x}y${y}`; // Standardized key
};

const getNoteCookieKey = (x?: number, y?: number): string | null => {
    if (x === undefined || y === undefined) return null;
    return `segmentNote:x${x}y${y}`; // Standardized key
};

// Style mapping (constant, not state)
const stateStyles: Record<SegmentState, string> = {
    finished: "bg-gradient-to-br from-green-400 to-green-400",
    pending: "bg-gradient-to-br from-yellow-300 to-yellow-300 ",
    error: "bg-gradient-to-br from-red-400 to-red-500",
};

function Segment({ index, corX, corY }: SegmentProps) {
    const stateCookieKey = getStateCookieKey(corX, corY);
    const noteCookieKey = getNoteCookieKey(corX, corY);

    // --- State Initialization ---
    // Read initial state from cookie, fallback to default
    const getInitialState = useCallback((): SegmentState => {
        if (!stateCookieKey) return DEFAULT_STATE; // Handle undefined coords
        const cookieState = Cookies.get(stateCookieKey);
        if (cookieState && VALID_STATES.includes(cookieState as SegmentState)) {
            return cookieState as SegmentState;
        }
        return DEFAULT_STATE;
    }, [stateCookieKey]); // Depend on the key

    // Read initial note from cookie
    const getInitialNote = useCallback((): string => {
        if (!noteCookieKey) return ""; // Handle undefined coords
        return Cookies.get(noteCookieKey) || "";
    }, [noteCookieKey]); // Depend on the key

    const [currentState, setCurrentState] = useState<SegmentState>(getInitialState);
    const [note, setNote] = useState<string>(getInitialNote);
    const [showPopUp, setShowPopUp] = useState(false);
    const noteRef = useRef<HTMLTextAreaElement>(null); // Correct ref type

    // --- Effects ---
    // Effect to focus textarea when popup opens
    useEffect(() => {
        if (showPopUp && noteRef.current) {
            noteRef.current.focus();
        }
    }, [showPopUp]);

    // Effect to update state if coordinates change after mount
    // (Handles cases where props might change)
    useEffect(() => {
        setCurrentState(getInitialState());
        setNote(getInitialNote());
    }, [corX, corY, getInitialState, getInitialNote]); // Re-run if coords or init functions change


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
         setShowPopUp(false); // Close popup after saving
    }, [noteCookieKey, note]); // Depend on key and current note value

    // Handle closing the popup (without saving note changes)
    const closePopup = useCallback(() => {
        // Reset note to the last saved value when closing without saving
        setNote(getInitialNote());
        setShowPopUp(false);
    }, [getInitialNote]);

    // Function to open the popup
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
                    w-full h-full flex items-center justify-center
                    cursor-pointer transition-all shadow-sm
                    hover:shadow-lg hover:scale-95 active:scale-100
                    rounded-lg aspect-square relative group`} // Added relative and group
                onClick={openPopup}
                title={`Segment ${index} (State: ${currentState})${hasNote ? ' - Has Note' : ''}`} // Tooltip
            >
                <span className="text-white font-bold drop-shadow-md select-none">
                    {index}
                </span>

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
                        className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in" // Added simple animation
                        onClick={(e) => {
                            e.preventDefault(); // Close popup on outside click
                            e.stopPropagation(); // Prevent event bubbling
                            
                        }}
                    >
                        {/* Close Button */}
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
                            Edit Segment <span className="text-blue-600 font-bold">#{index}</span>
                            {corX !== undefined && corY !== undefined && (
                                <span className="text-sm text-gray-500 ml-2">(X:{corX}, Y:{corY})</span>
                            )}
                        </h2>

                        <p className="text-sm font-medium text-gray-600 mb-2">Status:</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {(VALID_STATES).map(state => (
                                <button
                                    key={state}
                                    onClick={() => handleSetState(state)}
                                    className={`p-3 rounded-lg font-medium  transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                                        ${currentState === state
                                            ? `${stateStyles[state]} text-white shadow-md ring-2 ring-black`
                                            : `bg-${state === 'finished' ? 'green' : state === 'pending' ? 'yellow' : 'red'}-100
                                               hover:bg-${state === 'finished' ? 'green' : state === 'pending' ? 'yellow' : 'red'}-200
                                               text-${state === 'finished' ? 'green' : state === 'pending' ? 'yellow' : 'red'}-300
                                               focus:ring-${state === 'finished' ? 'green' : state === 'pending' ? 'yellow' : 'red'}-500`
                                        }`
                                    }
                                >
                                    {state.charAt(0).toUpperCase() + state.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Note Section */}
                        <div className="space-y-3">
                            <label htmlFor={`note-textarea-${index}-${corX}-${corY}`} className="block text-sm font-medium text-gray-700">
                                Observations
                            </label>
                            <textarea
                                id={`note-textarea-${index}-${corX}-${corY}`} // Unique ID
                                ref={noteRef}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                                rows={4}
                                placeholder="Add important notes..."
                            />
                            <button
                                onClick={saveNoteAndClose}
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

// Wrap with memo - generally good for performance if parent re-renders often
// and props don't change unnecessarily.
export default React.memo(Segment);