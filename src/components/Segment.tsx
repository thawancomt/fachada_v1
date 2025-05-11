import React, { useEffect, useState, useRef, useCallback } from "react";
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
  finished: "bg-green-500 hover:bg-green-600 text-white hover:text-gray-200",
  pending: "bg-yellow-500 hover:bg-yellow-600 text-white hover:text-gray-200",
  error: "bg-red-500 hover:bg-red-600 text-white hover:text-gray-200",
};

interface SegmentProps {
  index: { x: number; y: number };
  gridRepresentation: string;
  allowEdit?: boolean;
  facadeName: string;
  reRenderGridCallback?: () => void;

}

function Segment({ index, allowEdit, gridRepresentation, facadeName, reRenderGridCallback }: SegmentProps) {

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

  const [state, setState] = useState(allowEdit && dbManager.getSegmentState(facadeName, { x: index.x, y: index.y }) || DEFAULT_STATE);
  const [segmenteNote, setSegmentNote] = useState(allowEdit && dbManager.getSegmentNote(facadeName, { x: index.x, y: index.y }) || "");
  const [{ width, height }, setSize] = useState(allowEdit && dbManager.getSegmentArea(facadeName, { x: index.x, y: index.y }) || { width: 0, height: 0 });


  if (facadeName) {

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
  }

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

      <h2 className="text-xl font-semibold text-gray-800 mb-2 pr-8">
        Placa <span className="text-blue-600 font-bold">#{gridRepresentation}</span>
      </h2>

      <p className="text-sm font-medium text-gray-600 ">Definir status:</p>
      <p className="text-gray-500 text-sm font-medium ml-2">Estado atual: <span className={`${state == "finished" ? "text-green-500" : state == "pending" ? "text-yellow-500" : "text-red-500"}`}>{state == "finished" ? "Concluído" : state == "pending" ? "Pendente" : "Incompleto"}</span></p>

      <div className="grid grid-cols-3 gap-3 mt-2">
        {(VALID_STATES).map(state => (
          <button
            onClick={() => setState(state)}

            key={state}
            className={`cursor-pointer p-3 rounded-lg font-medium transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ` + stateStyles[state]}
          >
            {state == "finished" ? "Concluído" : state == "pending" ? "Pendente" : "Incompleto"}
          </button>
        ))}
      </div>


      <div className="m-2 space-y-3 bg-black/5 p-4 overflow-hidden rounded-lg shadow-sm">
        <label htmlFor="">Tamanho da Placa (milímetros)</label>
        <section className="flex  *:rounded-lg">
          <NumberInput label="largura mm" value={width} onChange={(value) => setSize(prev => ({ ...prev, width: value }))} />
          <NumberInput label="altura mm" value={height} onChange={(value) => setSize(prev => ({ ...prev, height: value }))} />
        </section>

        <div className="flex justify-between items-center bg-gray-200 p-2 rounded-sm shadow-sm">

          <label htmlFor="" className="text-sm font-medium text-gray-800">Aplicar para todas as placas horizontais</label>
          <input type="button" value={"aplicar"} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white font-medium" onClick={ () => {
            dbManager.applyAreaToAllLine(facadeName, index.x, { width, height});
            alert("Aplicado para todas as placas horizontais");
            reRenderGridCallback && reRenderGridCallback();
            
          }}/>
        </div>
        <div className="flex justify-between items-center bg-gray-200 p-2 rounded-sm shadow-2xl">
          <label htmlFor="" className="text-sm font-medium text-gray-800">Aplicar para todas as placas verticais</label>
          <input type="button" value={"aplicar"} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white font-medium" onClick={ () => {
            dbManager.applyAreaToAllColumn(facadeName, index.y, { width, height});
            alert("Aplicado para todas as placas verticais");
            reRenderGridCallback && reRenderGridCallback();
            
          }}/>
        </div>

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
          onClick={closePopup}
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
        className={`
          ${stateStyles[state]}
          flex items-center justify-center
          cursor-pointer transition-all shadow-sm
          hover:shadow-lg active:scale-100
          duration-1000 overflow-hidden
          rounded-lg aspect-square relative group
        `}
        onClick={() => allowEdit && openPopup()}
        style={{
          width: width
            ? `${width < 200 ? Math.max(width * 0.2, 40) : width * 0.05}px`
            : '300px',
          height: height
            ? `${height < 200 ? Math.max(height * 0.2, 40) : height * 0.05}px`
            : '120px',
        }}
      >
        {/* Main Content */}
        <section className="flex flex-col items-center gap-1">
          <span className="text-white font-bold drop-shadow-md select-none">
            {gridRepresentation}
          </span>
          <span className="text-black/60 font-semibold text-nowrap">
            {facadeName && (width && height)
              ? `${width}mm x ${height}mm`
              : "0x0"}
          </span>
        </section>

        {allowEdit && (
          <motion.div
            className="transform-gpu flex gap-2 z-50 absolute top-2 right-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              whileHover={{ rotate: 2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckIcon
                className="text-green-500 w-8 h-8 cursor-pointer hover:text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setState("finished");
                }}
              />
            </motion.div>

            <motion.div
              whileHover={{ rotate: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <XMarkIcon
                className="text-red-500 w-8 h-8 cursor-pointer hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setState("error");
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Popup Portal */}
      {(showPopUp && allowEdit) && createPortal(
        popupContainer,
        document.body
      )}
    </>
  );
}

export default React.memo(Segment, (prevProps, nextProps) => {
  return (
    prevProps.index.x === nextProps.index.x &&
    prevProps.index.y === nextProps.index.y &&
    prevProps.gridRepresentation === nextProps.gridRepresentation &&
    prevProps.facadeName === nextProps.facadeName 
  );
});
export type { SegmentState };
export { VALID_STATES, DEFAULT_STATE, stateStyles };