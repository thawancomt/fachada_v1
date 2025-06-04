
import { useEffect, useRef, useState } from "react";
import VALID_STATES from "./STATES/States";
import { PopupData, usePopup } from "./context/PopupContext";
import { useFacadeContext } from "./context/FacadeContext";

import windowsSvg from "./svgs/window.svg";

interface SegmentProps {
  index: { x: number, y: number };
  gridRepresentation: string;
}

const stateStyles: Record<VALID_STATES, string> = {
  "pending": "bg-orange-300",
  "approved": "bg-green-300",
  "rejected": "bg-red-300",
  "delivered": "bg-blue-300",
}

function Segment({ index, gridRepresentation }: SegmentProps) {

  const DEFAULT_DIMENSION = { width: 0, height: 0 };
  const DEFAULT_STATE: VALID_STATES = "pending";

  const [segmentState, setSegmentState] = useState<VALID_STATES>(DEFAULT_STATE);
  const [dimension, setDimension] = useState(DEFAULT_DIMENSION);
  const [note, setNote] = useState<string>("");
  const [isWindows, setIsWindows] = useState<boolean>(false);

  const { openPopup } = usePopup();

  const { facadeName, data: FacadeData } = useFacadeContext();


  // pop up
  const { isOpen } = usePopup();

  function clearSegmentData() {
    setSegmentState(DEFAULT_STATE);
    setDimension(DEFAULT_DIMENSION);
    setNote("");
    setIsWindows(false);
  }

  function handleClick() {
    const payload: PopupData = {
      state: segmentState,
      index: index,
      dimension: dimension,
      note: note,
      setNote: setNote,
      setDimension: setDimension,
      setState: setSegmentState,
      isWindows: isWindows,
      setIsWindows: setIsWindows,
    }

    openPopup(payload);

  }
  useEffect(() => {
    if (FacadeData[index.x]) {
      if (FacadeData[index.x][index.y]) {
        setSegmentState(FacadeData[index.x][index.y].state || "pending");
        setDimension(FacadeData[index.x][index.y].dimension || { width: 0, height: 0 });
        setNote(FacadeData[index.x][index.y].note || "");
        setIsWindows(FacadeData[index.x][index.y].isWindows || false);
        return;
      }
    }

    clearSegmentData();
  }, [facadeName, FacadeData])

  useEffect(() => {
    if (isOpen) {
      handleClick();
    }
  }, [segmentState, dimension, note, isWindows])


  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.padding = isWindows ? '0px' : '12px';
    }
  }, [isWindows]);

  return (
    <div
      ref={divRef}
      className="flex flex-col items-center justify-between rounded-xl border border-gray-200 bg-white  shadow-sm transition-all hover:shadow-md cursor-pointer h-full min-h-fit"
      onClick={handleClick}
      onMouseEnter={() => {
        setShowDetails(true);

      }}
      onMouseLeave={() => setShowDetails(false)}


      onMouseMove={(e) => {
        if (detailsRef.current) {
          detailsRef.current.style.left = `${e.clientX + 10}px`;
          detailsRef.current.style.top = `${e.clientY + 10}px`;
        }
      }}

      style={{
        width: dimension.width > 0 ? `${dimension.width / 5}px` : 'auto',
        height: dimension.height > 0 ? `${dimension.height / 5}px` : 'auto',
      }}
    >
      {
        showDetails && <div className="absolute p-4 bg-blue-50 rounded-2xl max-w-80" ref={detailsRef}>
          <span className="text-xs text-gray-500">
            Altura: {dimension.height > 0 ? `${dimension.height}mm` : 'N/A'}<br />
            Largura: {dimension.width > 0 ? `${dimension.width}mm` : 'N/A'}
          </span>
          <div className="text-wrap truncate">
            <span className="text-xs text-gray-500 text-wrap truncate w-full">notas: {note ? note : 'N/A'}</span>
          </div>
        </div>
      }

      {!isWindows ? <>
        <div className="flex w-full items-start justify-between">
          <h2 className="text-xl font-bold text-gray-800">{gridRepresentation}</h2>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${stateStyles[segmentState]}`}>
            {segmentState}
          </span>
        </div>

        <div className="mt-3 w-full space-y-1">
          {(dimension.width > 0 || dimension.height > 0) && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-1">Dimensões:</span>
              {dimension.width} x {dimension.height}
            </div>
          )}

          {note && (
            <div className="mt-2">
              <p className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 truncate w-full">
                {note}
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto w-full pt-2  text-xs text-gray-500">
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="truncate max-w-[60%]">{facadeName}</span>
            <span>({index.x}, {index.y})</span>
          </div>
        </div>
      </> : (
        // Representação de janela
        <div className="w-full h-full   flex items-center justify-center">
          <div className="bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg w-[100%] h-[100%] flex items-center justify-center">
            <span className="text-blue-800 font-bold text-lg">Janela</span>
          </div>
        </div>
      )
      }

    </div>
  );
}
export default Segment;
export { stateStyles };