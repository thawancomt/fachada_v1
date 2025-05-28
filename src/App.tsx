
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
import FacadeProvider from './context/FacadeContext';
import FacadeListItem from './smallComponents/FacadeListItem';

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
    <FacadeProvider>
      <GridProvider>
        <CreateFacadePopup isOpen={isOpen} setIsOpen={setIsOpen}></CreateFacadePopup>
        <PopupProvider>

          <div className='w-screen h-screen bg-gray-200 grid grid-cols-1 md:grid-cols-2'>
            <section>
              <div className='bg-gray-100 p-4 m-2 rounded shadow-lg flex flex-col gap-2'>
                <h1 className='text-blue-600 font-black text-2xl'>Gestao de fachadas</h1>
                <span className='text-gray-600 font-semibold'>Crie, gerencie e visualize suas fachadas.</span>
              </div>
              <section>

                <div>

                  <FacadeListContainer />            
                </div>

              </section>
            </section>
            <section>

              <GridManager/>
            </section>

          </div>
          <PopUpComponent />
        </PopupProvider>
      </GridProvider>
    </FacadeProvider>

  )
}

export default App;
