import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import NumberInput from "../NumberInput";
import GridManager from "../GridManager";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { dbManager } from "../utils/dbManager";

function NewFacadeSettingsPopUp({ onClose }: { onClose: () => void }) {
    const [rows, setRow] = React.useState<number>(0)
    const [cols, setCol] = React.useState<number>(0)

    const [indexX, setInverseX] = React.useState<boolean>(false)
    const [indexY, setInverseY] = React.useState<boolean>(false)
    const [onlyNumbersIndex, setOnlyNumbersIndex] = React.useState<boolean>(false)

    const [previewZoom, setPreviewZoom] = React.useState<number>(1)
    const [facadeName, setFacadeName] = React.useState<string>("")

    const exportOptions = () => {

        const newFacadeResult = dbManager.setNewFacade(
            {
                rows: rows,
                columns: cols,
                reverseIndex: indexX,
                inverseY: indexY,
                inverseX: indexX,
                onlyNumbersIndex: onlyNumbersIndex,
                facadeName: facadeName
            }
        )

        if (newFacadeResult) {
            alert("Fachada criada com sucesso!")
            clearCard()
            onClose()
        } else {
            alert("Erro ao criar a fachada. Verifique se o nome já existe ou se as dimensões são válidas.")
        }

    }

    const clearCard = () => {
        setRow(0)
        setCol(0)
        setInverseX(false)
        setInverseY(false)
        setOnlyNumbersIndex(false)
        setFacadeName("")
    }


    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={"newFacadeSettingsPopUp"} // Unique key for the component
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95, zIndex: 0 }}
                transition={{ damping: 200, stiffness: 100, duration: 0.5, delay: 0.1 }} // Adjusted transition for smoother animation
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative flex flex-col gap-6 my-8" // Added background, better shadow, padding, max-width, consistent gap
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" // Softer close button style
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Nova Fachada: Configurações Iniciais</h2> {/* Clearer Title */}

                {/* Facade Name Section */}
                <motion.div layout className="w-full space-y-1"> {/* Added space-y for consistency */}
                    <label htmlFor="facadeNameInput" className="block text-sm font-medium text-gray-700">Denominação da fachada</label>
                    <input
                        type="text"
                        id="facadeNameInput"
                        className="input-control-v1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" // Added standard input styles for consistency
                        value={facadeName}
                        onChange={(e) => setFacadeName(e.target.value)}
                        placeholder="Ex: Bloco A - Lado Norte" // Added placeholder
                    />
                </motion.div>

                {/* Grid Configuration Section */}
                <motion.div layout className="w-full border border-gray-200 rounded-lg p-4 space-y-4"> {/* Grouped settings visually */}
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dimensões e Indexação</h3> {/* Section title */}

                    {/* Rows and Columns Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid layout */}
                        <NumberInput label={"Placas Horizontais (Linhas)"} value={rows} onChange={setRow}></NumberInput>
                        <NumberInput label={"Placas Verticais (Colunas)"} value={cols} onChange={setCol}></NumberInput>
                    </div>

                    {/* Indexing Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 mt-4"> {/* Responsive grid, top border */}
                        {[
                            { label: "Inverter índice horizontal", state: indexX, setter: setInverseX, id: "invertX" },
                            { label: "Inverter índice vertical", state: indexY, setter: setInverseY, id: "invertY" },
                            { label: "Usar apenas números", state: onlyNumbersIndex, setter: setOnlyNumbersIndex, id: "onlyNumbers" },
                        ].map(item => (
                            <motion.div key={item.id} className="flex items-center gap-2 justify-start sm:justify-center"> {/* Consistent alignment */}
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    checked={item.state} // Use checked property
                                    onChange={(e) => item.setter(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" // Adjusted size, color, added cursor
                                />
                                <label htmlFor={item.id} className="text-sm font-medium text-gray-700 cursor-pointer">{item.label}</label> {/* Connect label with htmlFor */}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Preview Section */}
                <motion.div
                    layout
                    className="border border-gray-200 rounded-lg w-full overflow-hidden p-4 flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between gap-4 pb-2 border-b"> {/* Added bottom border */}
                        <h3 className="text-lg font-medium text-gray-900">Preview da Grade</h3>

                    </div>

                    <div className="relative w-full h-80 bg-gray-100 rounded-md border border-gray-300 overflow-hidden p-4"> {/* <<< ADICIONADO PADDING AQUI (p-4) */}
                        {(rows > 0 && cols > 0) ?
                            <TransformWrapper
                                initialScale={0.5} // Ajuste conforme necessário
                                minScale={0.1}
                                maxScale={5} // Defina um maxScale razoável
                                // initialPositionX={0} // Removido - Deixa centralizar
                                // initialPositionY={0} // Removido - Deixa centralizar
                                disablePadding={true} // Mantém o pan/zoom livre sem limites de borda da biblioteca
                                limitToBounds={false} // Garante que pode mover para fora da vista inicial
                            // wheel={{ step: 0.1 }} // Ajuste a sensibilidade do scroll do mouse se necessário
                            // pinch={{ step: 5 }}   // Ajuste a sensibilidade do pinch se necessário
                            >
                                {({ zoomIn, zoomOut, resetTransform, centerView, setTransform, ...rest }) => (
                                    // O `centerView()` pode ser útil para um botão de reset, centraliza baseado no conteúdo atual
                                    <TransformComponent
                                        // Estas classes ajudam a garantir que o componente transformado
                                        // e seu conteúdo interno se comportem bem dentro do espaço.
                                        wrapperClass="w-full h-full" // Faz o wrapper interno ocupar todo o espaço do TransformWrapper
                                        contentClass="flex items-center justify-center w-max h-max" // Centraliza o GridManager dentro da área de transformação e permite que ele tenha seu tamanho natural
                                    >
                                        <GridManager
                                            rows={rows}
                                            columns={cols}
                                            reverseIndex={indexX}
                                            inverseY={indexY}
                                            inverseX={indexX}
                                            onlyNumbersIndex={onlyNumbersIndex}
                                            allowEdit={false} // Set to false for preview
                                        />
                                    </TransformComponent>
                                )}
                            </TransformWrapper> :
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500"> {/* Placeholder text */}
                                <p className="text-sm">Adicione as dimensões para visualizar a grade.</p>
                            </div>
                        }
                    </div>
                </motion.div>

                {/* Action Button */}
                <div className="flex justify-end mt-4"> {/* Align button to the right */}
                    <button
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50" // Enhanced button style, added disabled state
                        onClick={() => exportOptions()} // Replace with actual creation logic
                        disabled={!facadeName || rows <= 0 || cols <= 0} // Disable if essential info is missing
                    >
                        Criar Fachada
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default NewFacadeSettingsPopUp;

