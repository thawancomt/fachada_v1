
import { useCallback, useEffect, useState } from "react";
import VALID_STATES from "./STATES/States";
import { PopupData, usePopup } from "./context/PopupContext";
import { useGridContext } from "./context/GridContext";
import { getSegmentData, SegmentData, updateSegment } from "./ORM/DbOperations";
import { useFacadeContext } from "./context/FacadeContext";

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

  const { facadeId, facadeName, data: FacadeData } = useFacadeContext();

  const [segmentData, setSegmentData] = useState<SegmentData | null>(null);

  useEffect(() => {
    async function fetchSegmentData() {

      // Search on data in grid context

      if (FacadeData[index.x] === undefined) {
        return;
      }

      if (FacadeData[index.x] && facadeId && facadeName) {

        if (FacadeData[index.x][index.y]) {
          console.log("Setting segment data from FacadeData", FacadeData[index.x][index.y]);

          setSegmentData({
            facadeId: facadeId,
            facadeName: facadeName,
            index: index,
            state: FacadeData[index.x][index.y].state || "approved",
            dimension: FacadeData[index.x][index.y].dimension || { width: 100, height: 100 },
            note: FacadeData[index.x][index.y].note || "",
          });
        }
      } else {
        return;
      }
    }
    fetchSegmentData();
  }, [facadeId, index, FacadeData]);


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

    if (!isOpen) return;

    if (isOpen && currentData?.index.x === index.x && currentData?.index.y === index.y) {
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
    if (segmentData) {
      setState(segmentData.state);
      setDimension(segmentData.dimension);
      setNote(segmentData.note);
    }
  }, [segmentData]);

  return (
    <div
      className={`${stateStyles[state]} flex flex-col rounded items-center justify-center`}
      style={{ width: dimension.width, height: dimension.height }}
      onClick={handleOpenPopup}
    >
      <h2 className="font-rubik font-medium">{gridRepresentation}</h2>
      <span>
          {dimension.width}x{dimension.height || "100x100"}
      </span>
    </div>
  );
}

export default Segment;
export { stateStyles };