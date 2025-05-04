import React from "react";
import FacadeLoader from "./utils/facadeLoader"; // Assumindo que está correto
import { motion, AnimatePresence } from "framer-motion";
import NewFacadeSettingsPopUp from "./popUps/newFacadeSettingsPopUp"; // Assumindo que está correto
import { PlusIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid'; // Exemplo com Heroicons

function StartFacade() {
    const facades = FacadeLoader(); // Você pode querer carregar isso dentro de um useEffect

    const [newFacadePopup, setNewFacadePopup] = React.useState<boolean>(false);

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
                <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out group">
                    <div className="flex items-center space-x-3">
                        <BuildingLibraryIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors truncate">
                            {key}
                        </span>
                    </div>
                </button>
            </motion.li>
        );
    });

    return (
        // AnimatePresence para o popup
        <AnimatePresence>
            {/* Container Principal */}
            <motion.div
                // Animação geral da página (pode remover se animar os cards individualmente)
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                // transition={{ duration: 0.4 }}
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
                    </motion.div>

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

            

        </AnimatePresence>
    );
}

export default StartFacade;