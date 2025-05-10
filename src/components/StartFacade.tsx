import { BuildingLibraryIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import GridManager from "./GridManager";
import NewFacadeSettingsPopUp from "./popUps/NewFacadeSettingsPopUp";
import { dbManager, FacadeOptions } from "./utils/dbManager";
import FacadeLoader from "./utils/facadeLoader";

function StartFacade() {
    const facades = FacadeLoader();
    const [newFacadePopup, setNewFacadePopup] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<FacadeOptions | null>(null)

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const facadesList = Object.keys(facades).map((key, index) => (
        <motion.li
            key={key}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <button
                onClick={() => {
                    setFacadeName(key);
                    setOptions(JSON.parse(JSON.stringify(facades[key])));
                }}
                className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out group"
            >
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <BuildingLibraryIcon className="w-5 h-5 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-indigo-900 transition-colors truncate">
                            {key}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="p-1 hover:bg-red-50 rounded-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("Voce confirma a exclusão da fachada?")) {
                                    dbManager.deleteFacade(key);
                                    window.location.reload();
                                }
                            }}
                        >
                            <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" />
                        </button>
                        <button className="p-1 hover:bg-blue-50 rounded-md">
                            <PencilSquareIcon className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                        </button>
                    </div>
                </div>
            </button>
        </motion.li>
    ));

    const FacadesListContainer = () => (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white shadow-xl rounded-2xl p-6 w-full"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Fachadas criadas</h2>
            {facadesList.length > 0 ? (
                <ul className="grid grid-cols-1 gap-3">
                    {facadesList}
                </ul>
            ) : (
                <div className="text-center py-6 space-y-2">
                    <BuildingLibraryIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500">Nenhuma fachada encontrada.</p>
                </div>
            )}
        </motion.div>
    )

    const PreviewCard = () => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-2xl rounded-2xl p-6 w-full border border-gray-100"
        >
            <div className="mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {options?.facadeName || "Preview da Fachada"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Configurações atuais da fachada</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 *:border *:border-gray-200 *:rounded-xl *:p-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-sm font-medium">Dimensões</span>
                    </div>
                    <div className="pl-7 space-y-2">
                        <div>
                            <label className="text-xs text-gray-400">Linhas</label>
                            <div className="text-gray-700 font-medium">{options?.rows}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Colunas</label>
                            <div className="text-gray-700 font-medium">{options?.columns}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium">Configurações</span>
                    </div>
                    <div className="pl-7 space-y-2">
                        {[
                            ['Index Reverso', options?.reverseIndex],
                            ['Inversão Y', options?.inverseY],
                            ['Inversão X', options?.inverseX],
                            ['Index Numérico', options?.onlyNumbersIndex]
                        ].map(([label, value]) => (
                            <div key={label as string} className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">{label}</span>
                                <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-gray-400'}`}>
                                    {value ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )

    return (
        <AnimatePresence>
            <motion.div
                className="min-h-screen bg-gradient-to-br from-blue-50/30 to-purple-50/30 p-6 sm:p-8 md:p-12 flex items-center justify-center lg:grid lg:grid-cols-2 lg:gap-8"
            >
                <div className="w-full max-w-4xl space-y-6">
                    <motion.h1
                        layout
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 90 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 text-center"
                    >
                        Gestão de Fachadas
                    </motion.h1>

                    <FacadesListContainer />

                    {options && <PreviewCard />}

                    <motion.div
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
                        className="bg-white shadow-xl rounded-2xl p-6 w-full flex flex-col sm:flex-row justify-between items-center gap-4"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">Criar nova fachada</h2>
                        <button
                            onClick={() => setNewFacadePopup(true)}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Criar Nova</span>
                        </button>
                    </motion.div>

                    {newFacadePopup && <NewFacadeSettingsPopUp onClose={() => setNewFacadePopup(false)} />}
                </div>
                <div className="w-full mt-8 lg:mt-0 flex flex-col h-[70vh] lg:h-[calc(100vh-4rem)] xl:h-[calc(100vh-4rem)]">
                    {options && (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0 text-center lg:text-left">
                                Preview da Grade: <span className="text-indigo-600">{options.facadeName}</span>
                            </h2>
                            <div className="border border-gray-300 rounded-lg p-0.5 flex-grow overflow-hidden relative bg-gray-100 shadow-lg">
                                <TransformWrapper
                                    initialScale={1}
                                    minScale={0.1}
                                    maxScale={5}  
                                    limitToBounds={true} 
                                    centerOnInit={true} 
                                    smooth={true}
                                    disablePadding={false} 
                                >
                                    <TransformComponent
                                        wrapperStyle={{ width: "100%", height: "100%" }}  
                                        contentStyle={{
                                            width: "auto", // Permite que o GridManager defina sua própria largura
                                            height: "auto", // Permite que o GridManager defina sua própria altura
                                            display: 'flex', // Útil para centralizar se GridManager for menor que o wrapper
                                            alignItems: 'center', // Centraliza verticalmente
                                            justifyContent: 'center', // Centraliza horizontalmente
                                            padding: '20px' // Adiciona um padding interno para o conteúdo não colar nas bordas
                                        }}
                                    >
                                        <GridManager
                                            columns={options.columns}
                                            rows={options.rows}
                                            allowEdit={true} // Se você tiver essa prop
                                            facadeName={options.facadeName}
                                        />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </>
                    )}
                    {!options && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Selecione uma fachada para visualizar a grade.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default StartFacade;