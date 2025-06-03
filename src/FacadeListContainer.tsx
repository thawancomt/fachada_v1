import React, { useEffect } from "react";
import { FacadeData, getAllFacades } from "./ORM/DbOperations";
import { FacadeContextOptions, useFacadeContext } from "./context/FacadeContext";
import { useGridContext } from "./context/GridContext";
import FacadeListItem from "./smallComponents/FacadeListItem";

export function FacadeListContainer() {


  const { loadFacadeList, setSideMenuOpen, facadeList } = useFacadeContext();

  async function handleLoadFacade() {
    const facades = await loadFacadeList();
  }

  const { data: facadeData, setFacadeOptions, facadeName } = useFacadeContext();
  const { setGridOptions } = useGridContext();


  const [searchInput, setSearchInput] = React.useState("");

  React.useEffect(() => {
    handleLoadFacade();
  }, [facadeList]);


  function handleClick(facade: FacadeData) {
    setGridOptions({
      rows: facade.grid.rows,
      columns: facade.grid.columns,
      useLetter: facade.grid.useLetter,
      reverseVertical: facade.grid.reverseVertical,
      reverseHorizontal: facade.grid.reverseHorizontal,
      prefix: facade.grid.prefix,
      suffix: facade.grid.suffix,
    });
    setFacadeOptions({

      facadeId: facade.id,
      facadeName: facade.name,
      data: facade.grid,
      createdAt: facade.createdAt,
      updatedAt: facade.updatedAt
    });
    setSideMenuOpen(false);
  }

  useEffect(() => {
    handleLoadFacade();
  }, [facadeData]);

  return (
    <>
      {facadeName ? <></> 
      :
       <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <section className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lista de Fachadas</h2>
          <p className="text-gray-600">Selecione ou busque uma das fachadas</p>
        </section>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquise por nome..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <ol className="space-y-3 max-h-[500px] overflow-y-auto m-2">
          {Array.from(facadeList.filter(facade =>
            facade.name.toLowerCase().includes(searchInput.toLowerCase())
          )).map((facade, index) => (
            <FacadeListItem
              key={index}
              facadeName={facade.name}
              grid={facade.grid}
              onClick={() => handleClick(facade)}
            />
          ))}
        </ol>
      </div>}
    </>
  );
}