import React, { useEffect } from "react";
import FacadeLoader from "./utils/facadeLoader"; // Assumindo que está correto
import { motion, AnimatePresence } from "framer-motion";
import NewFacadeSettingsPopUp from "./popUps/NewFacadeSettingsPopUp"; // Assumindo que está correto
import { PlusIcon, BuildingLibraryIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid'; // Exemplo com Heroicons
import { dbManager, FacadeOptions } from "./utils/dbManager";
import GridManager from "./GridManager";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

function StartFacade() {
    const facades = FacadeLoader(); // Você pode querer carregar isso dentro de um useEffect

    const [newFacadePopup, setNewFacadePopup] = React.useState<boolean>(false);

    const [facadeName, setFacadeName] = React.useState<string>("");

    const [options, setOptions] = React.useState<FacadeOptions | null>(null)

    useEffect(() => {
        console.log("NEW_: ", options);

    }, [options])

    // Variantes para animação dos cards (opcional, para escalonar a entrada)
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const facadesList = Object.keys(facades).map((key, index) => {
        return (
            <motion.li

                key={key} // Use a key única da fachada se possível, senão o índice
                layout // Anima a posição se a lista mudar
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // Stagger effect
            >
                <button onClick={() => {
                    setFacadeName(key);
                    setOptions(JSON.parse(JSON.stringify(facades[key]))); 
                }}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out group">
                    <div className="flex justify-between items-center space-x-3">
                        <div className="flex gap-2 items-center">
                            <BuildingLibraryIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors truncate">
                                {key}
                            </span>

                        </div>

                        <div className="flex">
                            <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("Voce confirma a exclusão da fachada?")) {
                                    dbManager.deleteFacade(key);
                                    window.location.reload(); // Recarrega a página para atualizar a lista
                                }


                            }} />
                            <PencilSquareIcon className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" onClick={(e) => {
                            }} />
                        </div>
                    </div>
                </button>
            </motion.li>
        );
    });


    const FacadesListContainer = () => {
        return (
            <motion.div
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white shadow-lg rounded-xl p-6 w-full" // Card styling
            >
                <h2 className="text-xl font-semibold text-gray-700 mb-5">Fachadas criadas</h2>
                {facadesList.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Grid responsivo */}
                        {facadesList}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Nenhuma fachada encontrada.</p> // Mensagem se vazio
                )}
            </motion.div>)
    }

    const PreviewCard = () => {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-xl rounded-2xl p-6 w-full border border-gray-100">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {options?.facadeName || "Preview da Fachada"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Configurações atuais da fachada</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 *:border *:border-gray-500/40 *:rounded *:p-4">
                    {/* Primeira Coluna */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    {/* Segunda Coluna */}
                    <div className="space-y-3 ">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium">Configurações</span>
                        </div>

                        <div className="pl-7 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Index Reverso</span>
                                <span className={`text-sm font-medium ${options?.reverseIndex ? 'text-green-600' : 'text-gray-400'}`}>
                                    {options?.reverseIndex ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Inversão Y</span>
                                <span className={`text-sm font-medium ${options?.inverseY ? 'text-green-600' : 'text-gray-400'}`}>
                                    {options?.inverseY ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Inversão X</span>
                                <span className={`text-sm font-medium ${options?.inverseX ? 'text-green-600' : 'text-gray-400'}`}>
                                    {options?.inverseX ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Index Numérico</span>
                                <span className={`text-sm font-medium ${options?.onlyNumbersIndex ? 'text-green-600' : 'text-gray-400'}`}>
                                    {options?.onlyNumbersIndex ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm text-gray-600 mt-4">Preview da grade:</h2>
                </div>

                <button className="bg-blue-500 p-2 text-white hover:bg-blue-600 hover:text-blue-100  transition-all duration-500 rounded w-full mt-8">Abrir</button>
            </motion.div>
        )
    }

    return (
        // AnimatePresence para o popup
        <AnimatePresence>
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-8 md:p-12" // Fundo gradiente sutil, padding responsivo
            >
                <div className="w-full max-w-4xl space-y-8"> {/* Limita a largura e adiciona espaço entre os elementos filhos */}

                    {/* Título */}
                    <motion.h1
                        layout
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 75 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-800 text-center" // Usa classes Tailwind
                    >
                        Gestão de Fachadas
                    </motion.h1>

                    {/* Card: Fachadas Criadas */}
                    <FacadesListContainer />

                    <PreviewCard />


                    {/* Card: Criar Nova Fachada */}
                    <motion.div
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }} // Pequeno delay
                        className="bg-white shadow-lg rounded-xl p-6 w-full flex flex-col sm:flex-row justify-between items-center" // Card styling, flex para alinhar
                    >
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 sm:mb-0">Criar nova fachada</h2>
                        <button
                            onClick={() => setNewFacadePopup(true)}
                            className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out" // Botão primário destacado
                        >
                            <PlusIcon className="w-5 h-5 mr-2 -ml-1" /> {/* Ícone */}
                            Criar Nova
                        </button>
                    </motion.div>

                </div>
                {newFacadePopup && <NewFacadeSettingsPopUp onClose={() => setNewFacadePopup(false)} />}




            </motion.div>


            <GridManager columns={3} rows={3} allowEdit={true} />

        </AnimatePresence>
    );
}

export default StartFacade;