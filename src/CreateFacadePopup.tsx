import React from "react";
import { saveFacade } from "./ORM/DbOperations";
import { useFacadeContext } from "./context/FacadeContext";

export function CreateFacadePopup() {

  const [facadeName, setFacadeName] = React.useState("");
  const [gridRows, setGridRows] = React.useState(2);
  const [gridColumns, setGridColumns] = React.useState(5);
  const [reverseVertical, setReverseVertical] = React.useState(false);
  const [reverseHorizontal, setReverseHorizontal] = React.useState(false);
  const [useLetter, setUseLetter] = React.useState(false);
  const [prefix, setPrefix] = React.useState("");
  const [suffix, setSuffix] = React.useState("");


  const { createNewFacadeMenu, setCreateNewFacadeMenu, loadFacadeList } = useFacadeContext();
  
  async function handleSave() {
    saveFacade(
      {
        name: facadeName,
        grid: {
          rows: gridRows,
          columns: gridColumns,
          useLetter: useLetter,
          reverseVertical: reverseVertical,
          reverseHorizontal: reverseHorizontal,
          prefix: prefix,
          suffix: suffix
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    await loadFacadeList()

  }


  return (
    <>
      {createNewFacadeMenu && (
        <div
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setCreateNewFacadeMenu(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Criar Nova Fachada</h2>
                <button
                  onClick={() => setCreateNewFacadeMenu(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Fachada
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={facadeName}
                    onChange={(e) => setFacadeName(e.target.value)}
                    placeholder="Digite o nome da fachada"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Linhas
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={gridRows}
                      onChange={(e) => setGridRows(Number(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colunas
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={gridColumns}
                      onChange={(e) => setGridColumns(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useLetterCheckbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={useLetter}
                      onChange={(e) => setUseLetter(e.target.checked)}
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
                      onChange={(e) => setReverseVertical(e.target.checked)}
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
                      onChange={(e) => setReverseHorizontal(e.target.checked)}
                    />
                    <label htmlFor="reverseHorizontalCheckbox" className="ml-2 text-sm text-gray-700">
                      Inverter horizontalmente
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prefixo
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
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
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="Ex: -A"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                onClick={() => setCreateNewFacadeMenu(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={async () => {
                  await handleSave();
                  setCreateNewFacadeMenu(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Salvar Fachada
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}