
import VALID_STATES from "./STATES/States";
import { VALID_STATES_OBJECT } from "./STATES/States";
import { PopupData, usePopup } from "./context/PopupContext";
import { stateStyles } from "./Segment";
import { useGridContext } from "./context/GridContext";
import { updateSegment } from "./ORM/DbOperations";
import { useEffect } from "react";

interface SegmentPopupProps {
    index: { x: number, y: number };
    state: VALID_STATES;
    gridRepresentation: string;
    onClose?: () => void;
}




function Card({ data }: { data: PopupData }) {
    const { facadeName, facadeId } = useGridContext();

    
    function handleSave() {
        console.log("Card data changed:", data);
        if (data && facadeName && facadeId) {
            updateSegment({
                facadeName: facadeName,
                facadeId: facadeId,
                index: data.index,
                state: data.state,
                dimension: data.dimension,
                note: data.note
            });
        }
    }

    return (
        <div className="bg-white inset-0 w-full h-fit">
            <div>
                <span>Fachada: {facadeName}</span>
                <section>
                    <h1>Placa <strong>{data?.index.x}:{data?.index.y}</strong> </h1>

                </section>
                <section className="*:border *:m-2">

                    <div>
                        <label htmlFor="width-input" >Width:</label>
                        <input type="number" value={data.dimension.width} onChange={(e) => {data.setDimension({...data.dimension, width: parseInt(e.target.value)})}} />
                    </div>
                    <div>
                        <label htmlFor="height-input">Height:</label>
                        <input type="number" value={data.dimension.height} onChange={(e) => {data.setDimension({...data.dimension, height: parseInt(e.target.value)})}} />
                    </div>

                    <section>
                        <h2>Status</h2>

                        {
                            Array.from({ length: VALID_STATES_OBJECT.length }).map((_, index) => {
                                return (
                                    <div key={index} className="border m-2"
                                        onClick={() => {
                                            data.setState(VALID_STATES_OBJECT[index]);
                                        }}>
                                        <button className={`${stateStyles[VALID_STATES_OBJECT[index]]}`}
                                        >{VALID_STATES_OBJECT[index]}</button>
                                    </div>
                                )
                            })
                        }
                    </section>

                </section>
                <div>
                    <label htmlFor="note-input">Nota:</label>
                    <textarea id="note-input" value={data.note} onChange={(e) => data.setNote(e.target.value)} className="w-full h-32 border p-2" />
                </div>
            </div>
            <button className="bg-blue-500 w-full p-4 rounded" onClick={handleSave}>Salvar</button>
        </div>
    )
}


function SegmentPopup() {

    const { isOpen, data, closePopup } = usePopup();

    if (!isOpen || !data) return null;

    return (
        <div>
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center" onClick={closePopup}>
            </div>
            <div className="bg-white p-4 rounded shadow-lg fixed inset-0 w-fit h-fit m-auto">
                <Card data={data} />
            </div>
        </div>
    )
}

export default SegmentPopup;


export type { SegmentPopupProps };