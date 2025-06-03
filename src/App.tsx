import './output.css'
import SegmentPopup from './SegmentPopup';
import ReactDOM from 'react-dom';
import GridManager from './GridManager';
import { PopupProvider } from './context/PopupContext';
import { GridProvider } from './context/GridContext';
import { CreateFacadePopup } from './CreateFacadePopup';
import React from 'react';
import { FacadeListContainer } from './FacadeListContainer';
import FacadeProvider from './context/FacadeContext';
import FacadeVisualizerCard from './smallComponents/FacadeVisualizerCard';
import SideMenu from './SideMenu';

function App() {

  function PopUpComponent() {
    return (
      <>
        {ReactDOM.createPortal(
          <SegmentPopup />,
          document.body
        )}
      </>
    )
  }

  // State for the "Create New Facade" popup
  const [isCreateFacadePopupOpen, setIsCreateFacadePopupOpen] = React.useState(false);
  // State for sidebar visibility, defaulting to true (open)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);


  return (
    <FacadeProvider>
      <GridProvider>
        {/* Popups are rendered at the top level, CreateFacadePopup is modal */}
        
        
        <PopupProvider>
          {/* SegmentPopup is also modal-like, managed by its provider and rendered via portal */}
          <PopUpComponent />

          {/* Main application layout: flex container for sidebar and main content */}
          <div className="flex h-screen bg-slate-100 text-gray-800">
            
            <SideMenu />
            <CreateFacadePopup  />

            {/* Main Content Area */}
            <main className="flex-grow h-screen overflow-y-auto p-4 md:p-6">
              
              
              <div className={!isSidebarOpen ? "pt-12 md:pt-0" : ""}>
                 <GridManager />
              </div>
            </main>
          </div>
        </PopupProvider>
      </GridProvider>
    </FacadeProvider>
  )
}

export default App;