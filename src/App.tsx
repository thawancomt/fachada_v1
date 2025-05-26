
import './output.css'
import SegmentPopup from './SegmentPopup';
import ReactDOM from 'react-dom';
import GridManager from './GridManager';
import { PopupProvider } from './context/PopupContext';
import { GridProvider, useGridContext } from './context/GridContext';
import { CreateFacadePopup } from './CreateFacadePopup';
import React from 'react';
import { FacadeData, getAllFacades } from './ORM/DbOperations';
import { FacadeListContainer } from './FacadeListContainer';

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

  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <GridProvider>
      <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setIsOpen(true)}>
        Criar fachada
      </button>

      <FacadeListContainer />
      <CreateFacadePopup isOpen={isOpen} setIsOpen={setIsOpen}></CreateFacadePopup>
      <PopupProvider>
        <div className="w-full ">

          <div className='bg-red-300'>
            <GridManager />

          </div>

          <PopUpComponent />
        </div>
      </PopupProvider>
    </GridProvider>
  )
}

export default App;
