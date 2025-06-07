import './styles.css';
import SegmentPopup from './SegmentPopup';
import ReactDOM from 'react-dom';
import GridManager from './GridManager';
import { PopupProvider } from './context/PopupContext';
import { GridProvider } from './context/GridContext';
import { CreateFacadePopup } from './CreateFacadePopup';
import FacadeProvider from './context/FacadeContext';
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

  return (
    <FacadeProvider>
      <GridProvider>


        <PopupProvider>
          <PopUpComponent />
          <div className="flex h-screen bg-slate-100 text-gray-800">

            <SideMenu />
            <CreateFacadePopup />

            <main className="flex-grow h-screen overflow-y-auto p-4 md:p-6 ">

                <GridManager />
            </main>
          </div>
        </PopupProvider>
      </GridProvider>
    </FacadeProvider>
  )
}

export default App;