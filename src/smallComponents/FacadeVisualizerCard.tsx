import { useFacadeContext } from "../context/FacadeContext";
import { useGridContext } from "../context/GridContext";
import { updateFacade } from "../ORM/DbOperations";

export default function FacadeVisualizerCard() {
    const { facadeName, createdAt, updatedAt, setFacadeOptions, facadeId,  } = useFacadeContext();
    const { columns, rows, reverseVertical, reverseHorizontal, useLetter, setGridOptions, gap, prefix, suffix } = useGridContext();

    function handleClose() {
        setGridOptions({
            rows: 0,
            columns: 0,
            useLetter: false,
            reverseVertical: false,
            reverseHorizontal: false,
            prefix: "",
            suffix: "",
            gap: 1,
        });
        setFacadeOptions({
            facadeId: 0,
            facadeName: "",
            data: { 0: { 0: {} } },
            createdAt: undefined,
            updatedAt: undefined,
        })
    }

    function handleSave() {
        updateFacade(
            {
                name: facadeName,
                grid: {
                    columns: columns,
                    rows: rows,
                    useLetter: useLetter,
                    reverseVertical: reverseVertical,
                    reverseHorizontal: reverseHorizontal,

                },
                createdAt: createdAt || new Date(),
                updatedAt: updatedAt || new Date(),
                id: facadeId
            }
        )
    }


    return (
  <>
    {facadeName && (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 transition-all ">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{facadeName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {rows * columns} placas
                </span>
              </div>
            </div>
            
            <div className="text-right text-xs text-gray-500">
              <p>Criada em: {createdAt?.toLocaleDateString()}</p>
              <p>Atualizada em: {updatedAt?.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Grid Options */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Configurações da Grade</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useLetterCheckbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={useLetter}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      useLetter: e.target.checked
                    }));
                  }}
                />
                <label htmlFor="useLetterCheckbox" className="ml-2 text-sm text-gray-700">
                  Usar letras nos índices
                </label>
              </div>

              
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reverseVerticalCheckbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={reverseVertical}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      reverseVertical: e.target.checked
                    }));
                  }}
                />
                <label htmlFor="reverseVerticalCheckbox" className="ml-2 text-sm text-gray-700">
                  Inverter verticalmente
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reverseHorizontalCheckbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={reverseHorizontal}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      reverseHorizontal: e.target.checked
                    }));
                  }}
                />
                <label htmlFor="reverseHorizontalCheckbox" className="ml-2 text-sm text-gray-700">
                  Inverter horizontalmente
                </label>
              </div>

              {/* Sufix and prefix */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefixo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={prefix}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      prefix: e.target.value
                    }));
                  }}
                  placeholder="Ex: P-"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sufixo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={suffix}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      suffix: e.target.value
                    }));
                  }}
                  placeholder="Ex: -A"
                />
              </div>
              
              <div className="flex items-center justify-between col-span-full border/20 p-1 rounded-lg bg-gray-100 mt-2">
                <label htmlFor="gap-input" className="ml-2 text-sm text-gray-700">Tamanho da alheta</label>
                <input
                  id="gap-input"
                  type="number"
                  className="border rounded w-12 text-center"
                  value={gap}
                  onChange={(e) => {
                    setGridOptions(prev => ({
                      ...prev,
                      gap: Number(e.target.value) < 0 ? 0 : Number(e.target.value)
                    }))
                  }}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
              onClick={handleSave}
            >
              Salvar Alterações
            </button>
            <button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
              onClick={handleClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

}
