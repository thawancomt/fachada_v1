
import { useCallback, useEffect, useState } from "react";
import VALID_STATES from "./STATES/States";
import { PopupData, usePopup } from "./context/PopupContext";
import { useGridContext } from "./context/GridContext";
import { getSegmentData, SegmentData, updateSegment } from "./ORM/DbOperations";

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

  const { facadeId, facadeName } = useGridContext();

  const [segmentData, setSegmentData] = useState<SegmentData | null>(null);

  useEffect(() => {
    async function fetchSegmentData() {
      if (facadeId) {
        const data = await getSegmentData(facadeId, index);
        if (data) {
          setSegmentData(data);
          setState(data.state);
          setDimension(data.dimension);
          setNote(data.note);
        }
      }
    }
    fetchSegmentData();
  }, [facadeId, index]);


  const [state, setState] = useState<VALID_STATES>(segmentData?.state || "pending");

  const [dimension, setDimension] = useState({
    width: segmentData?.dimension.width || 100,
    height: segmentData?.dimension.height || 100,
  });

  const [note, setNote] = useState<string>(segmentData?.note || "");

  const { isOpen, data: currentData, openPopup } = usePopup();




  const handleOpenPopup = useCallback(() => {
    console.debug("Clicked on segment", index, state, gridRepresentation);

    const payload: PopupData = {
      state: state,
      index: index,
      dimension: dimension,
      setDimension: setDimension,
      setState: setState,
      setNote: setNote,
      note: note,
    };

    openPopup(payload);


  }, [index, state, dimension, setDimension, setState, setNote, openPopup]);

  useEffect(() => {
    if (isOpen && currentData?.index.x === index.x && currentData?.index.y === index.y ) {
      const updatePayload: PopupData = {
        state: state,
        index: index,
        dimension: dimension,
        setDimension: setDimension,
        setState: setState,
        setNote: setNote,
        note: note,
      }
      openPopup(updatePayload);
      if (facadeId !== undefined && facadeName) {

        updateSegment({
          facadeName: facadeName,
          facadeId: facadeId,
          index: index,
          state: state,
          dimension: dimension,
          note: note
        }).catch((error) => {
          console.error("Error updating segment:", error);
        })
      }

    }

  }, [state, dimension, note])

  useEffect(() => {
    console.log("renderized segment", index, state, gridRepresentation);

  }, [state, index, gridRepresentation]);

  return (
    <div
      className={`w-32 h-32 ${stateStyles[state]} flex flex-col border m-2`}
      onClick={handleOpenPopup}
    >
      <span>Fachada: {facadeName}</span>
      <span>{gridRepresentation}</span>
      <span>{state}</span>
      <span>{`(${index.x}, ${index.y})`}</span>
      <span>{`${dimension.width}x${dimension.height}`}</span>
    </div>
  );
}

export default Segment;
export { stateStyles };