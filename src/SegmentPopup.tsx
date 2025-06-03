
import VALID_STATES from "./STATES/States";
import { VALID_STATES_OBJECT } from "./STATES/States";
import { PopupData, usePopup } from "./context/PopupContext";
import { stateStyles } from "./Segment";
import { useGridContext } from "./context/GridContext";
import { useFacadeContext } from "./context/FacadeContext";

interface SegmentPopupProps {
    index: { x: number, y: number };
    state: VALID_STATES;
    gridRepresentation: string;
    onClose?: () => void;
}
    



function Card({ data }: { data: PopupData }) {
    const { facadeName, facadeId, updateSegmentDataInContext } = useFacadeContext();
    const { closePopup } = usePopup();
    const {applyOnXaxis, applyOnYaxis} = useGridContext();



    function handleSave() {

        if (data && facadeName) {
            updateSegmentDataInContext({
                facadeName: facadeName,
                facadeId: facadeId,
                index: data.index,
                state: data.state,
                dimension: data.dimension,
                note: data.note
            });

            closePopup();


        } else {
            alert("Dados incompletos para salvar o segmento.");
        }
    }



    return (
    <div 
      className="w-screen h-screen fixed top-0 bg-black/70 overflow-hidden  flex items-center justify-center z-50"
      onClick={closePopup}
    >
      <div 
        className="bg-white p-2  rounded-lg border m-2 w-fit h-fit overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detalhes da Placa</h2>
              <p className="text-gray-600 mt-1">
                Fachada: <span className="font-medium">{facadeName}</span>
              </p>
            </div>
            <button 
              onClick={closePopup}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-center text-gray-800">
              Posição: <span className="text-blue-600">({data.index.x}, {data.index.y})</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largura (cm)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={data.dimension.width}
                onChange={(e) => {
                  data.setDimension({ ...data.dimension, width: parseInt(e.target.value) || 0 });
                }}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={data.dimension.height}
                onChange={(e) => {
                  data.setDimension({ ...data.dimension, height: parseInt(e.target.value) || 0 });
                }}
                min="0"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status da Placa</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VALID_STATES_OBJECT.map((state, index) => (
                <button
                  key={index}
                  className={`py-2 px-3 rounded-lg text-center font-medium transition-all ${
                    data.state === state 
                      ? 'ring-2 ring-blue-500 scale-[1.02]' 
                      : 'hover:opacity-90'
                  } ${stateStyles[state]}`}
                  onClick={() => data.setState(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas/Observações
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
              value={data.note}
              onChange={(e) => data.setNote(e.target.value)}
              placeholder="Adicione informações relevantes sobre esta placa..."
            />
          </div>

          {/* Botões para aplicar em linha/coluna */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                applyOnXaxis({
                  dimension: { width: data.dimension.width, height: data.dimension.height },
                  index: { x: data.index.x, y: data.index.y }
                });
                closePopup();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Aplicar na linha toda
            </button>
            
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                applyOnYaxis({
                  dimension: { width: data.dimension.width, height: data.dimension.height },
                  index: { x: data.index.x, y: data.index.y }
                });
                closePopup();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Aplicar na coluna toda
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={handleSave}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}


function SegmentPopup() {

    const { isOpen, data } = usePopup();

    if (!isOpen || !data) return null;

    return (

        <Card data={data} />
    )
}

export default SegmentPopup;

export type { SegmentPopupProps };