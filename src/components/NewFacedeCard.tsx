import React, { useEffect } from "react"
import BuildingDraw from "./BuildingDraw"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import NumberInput from "./NumberInput"


function NewFacadeCard() {

  const [row, setRow] = React.useState<number>(Cookies.get("row") ? Number(Cookies.get("row")) : 0)
  const [col, setCol] = React.useState<number>(Cookies.get("col") ? Number(Cookies.get("col")) : 0)
  const [index, setIndex] = React.useState<boolean>(false)
  const [inverseY, setInverse] = React.useState<boolean>(false)
  const [inverseX, setInverseX] = React.useState<boolean>(false)
  const [onlyNumbersIndex, setOnlyNumbersIndex] = React.useState<boolean>(false)


  useEffect(() => {
    const rowCookie = Cookies.get("row")
    const colCookie = Cookies.get("col")

    if (rowCookie) {
      setRow(Number(rowCookie))
    }

    if (colCookie) {
      setCol(Number(colCookie))
    }
  }, [])

  useEffect(() => {
    Cookies.set("row", String(row), { expires: 15 })
    Cookies.set("col", String(col), { expires: 15 })

    console.log("setting cookie");

  }, [row, col])

  useEffect(() => {
    if (index) {
      setOnlyNumbersIndex(false)
    }

    if (onlyNumbersIndex) {
      setIndex(false)
    }

  }, [index, onlyNumbersIndex])

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col lg:flex-row gap-8">
      {/* Card de Controles */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações da Fachada</h2>

        <div className="space-y-6">
          {/* Inputs de Linhas e Colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peças Horizontais
              </label>
              <NumberInput value={row} onChange={setRow} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peças Verticais
              </label>
              <NumberInput value={col} onChange={setCol} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apenas numeros no índice
              </label>
              <input
                type="checkbox"
                onChange={(e) => setOnlyNumbersIndex(e.target.checked)}
                disabled={index}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 w-full">
                Nome da fachada
              </label>
              <section className="space-y-4">
                <input
                  type="text"
                  onChange={(e) => setOnlyNumbersIndex(e.target.checked)}
                  disabled={index}
                  className="input-control-v1 w-full"
                />

                <button onClick={() => console.log("Salvar clicked")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">Salvar</button>
              </section>
            </div> */}
          </div>

          {/* Checkboxes de Configuração */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => setIndex(e.target.checked)}
                disabled={onlyNumbersIndex}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm text-gray-700">
                Inverter Indexação
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => setInverse(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm text-gray-700">
                Inverter Eixo Y
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => setInverseX(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm text-gray-700">
                Inverter Eixo X
              </label>
            </div>
            <div className="flex items-center bg-red-400/30 p-2 rounded-lg">
              <button 
                onClick={ ()  => {
                  setRow(0)
                  setCol(0)
                  setIndex(false)
                  setInverse(false)
                  setInverseX(false)
                  setOnlyNumbersIndex(false)

                  document.cookie.split(";").forEach(function(cookie) {
                    const name = cookie.split("=")[0].trim();
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                });

                }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">Resetar</button>
              <label className="ml-3 text-sm text-gray-700">
                Resetar fachada
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Pré-visualização</h3>
        <div className="w-full overflow-auto p-2 bg-gray-100 rounded-xl min-h-[500px] flex items-center justify-center">
          {row && col && (
            <BuildingDraw
              rows={row}
              columns={col}
              index={index}
              inverseY={inverseY}
              inverseX={inverseX}
              onlyNumbersIndex={onlyNumbersIndex}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default NewFacadeCard