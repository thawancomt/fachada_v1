import { useFacadeContext } from "./context/FacadeContext";
import { FacadeListContainer } from "./FacadeListContainer";
import FacadeVisualizerCard from "./smallComponents/FacadeVisualizerCard";

export default function SideMenu() {

    const { sideMenuOpen, setSideMenuOpen,  setCreateNewFacadeMenu } = useFacadeContext();

    return (
        <>
            {sideMenuOpen ? <aside className="w-full md:w-[480px] h-screen shadow-xl flex flex-col fixed top-0 left-0 z-10 
                               md:relative md:translate-x-0 transition-transform duration-300 ease-in-out 
                               transform translate-x-0  bg-gray-200 ">
                {/* On small screens, it's fixed and overlays. On md+, it's part of the flow. */}
                {/* The transform translate-x-0 is the 'open' state.
                                   A '-translate-x-full' would be for 'closed' if not conditionally rendered.
                                   Since we conditionally render, this part is simpler.
                                   Shadow 'shadow-xl' gives it more prominence.
                                */}

                {/* Inner container for padding and flex column layout for sidebar contents */}
                <div className="p-6 flex flex-col flex-grow h-0"> {/* h-0 with flex-grow allows child to scroll correctly */}

                    {/* Sidebar Header Section */}
                    <div className="mb-6 shrink-0">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl lg:text-3xl font-bold  text-blue-600">Gestão de Fachadas</h1>
                            {/* Optional: Close button for sidebar on small screens */}
                            <button
                                className=" text-gray-500 hover:text-gray-700"
                                title="Fechar menu"
                                onClick={() => {
                                    setSideMenuOpen && setSideMenuOpen(false);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Crie, gerencie e visualize suas fachadas.
                        </p>
                    </div>

                    {/* Scrollable Middle Section for dynamic content */}
                    <div className="flex-grow space-y-6 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                        {/* pr-2 for scrollbar spacing, add custom-scrollbar class if you have one */}
                        <FacadeVisualizerCard />
                        <FacadeListContainer />
                    </div>

                    {/* Sidebar Footer Section: "Create New Facade" Button */}
                    <div className="">
                        <button
                            onClick={ () => {
                                setCreateNewFacadeMenu?.(true);
                                
                            }}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Criar Nova Fachada
                        </button>
                    </div>
                </div>
            </aside> :
                <button
                    className={`fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300`}
                    title="Abrir menu"
                    onClick={ () => {
                        setSideMenuOpen && setSideMenuOpen(true);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            }
        </>


    )
}