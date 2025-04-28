import React, { useEffect } from "react"
import BuildingDraw from "./BuildingDraw"
import Cookies from "js-cookie"
import { motion } from "framer-motion"


function NewFacadeCard() {

    const [row, setRow] = React.useState<number>(Cookies.get("row") ? Number(Cookies.get("row")) : 0)
    const [col, setCol] = React.useState<number>(Cookies.get("col") ? Number(Cookies.get("col")) : 0)
    const [index, setIndex] = React.useState<boolean>(false)
    const [inverseY, setInverse] = React.useState<boolean>(false)
    const [inverseX, setInverseX] = React.useState<boolean>(false)


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
                  <input
                    type="number"
                    value={row}
                    onChange={(e) => setRow(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peças Verticais
                  </label>
                  <input
                    type="number"
                    value={col}
                    onChange={(e) => setCol(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
    
              {/* Checkboxes de Configuração */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => setIndex(e.target.checked)}
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
                />
              )}
            </div>
          </div>
        </div>
      )
    }

export default NewFacadeCard