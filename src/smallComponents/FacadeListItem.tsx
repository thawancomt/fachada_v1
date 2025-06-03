import { BuildingOfficeIcon } from '@heroicons/react/24/solid'
import { useFacadeContext } from '../context/FacadeContext';
type FacadeListItemProps = {
    facadeName: string;
    grid: {
        rows: number;
        columns: number;
    }
    onClick?: () => void;
}

export default function FacadeListItem({ facadeName, grid, onClick }: FacadeListItemProps) {

    const {facadeName : contextFacadeName} = useFacadeContext();

    return (
    <li
      className={`bg-gray-200 m-2 rounded-xl border border-gray-200 shadow-sm p-4 transition-all duration-300 hover:shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-300  group
        ${facadeName === contextFacadeName ? 'ring-2 ring-green-400 border-green-400' : 'hover:border-blue-300'}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1 truncate pr-2">
        <h2 className="font-bold text-gray-800 truncate text-lg group-hover:text-blue-600">{facadeName}</h2>
        <p className="text-sm text-gray-600 text-wrap !font-bold">
          <span className="font-medium">Peças: <br /> </span> {grid.rows} linhas × {grid.columns} colunas
        </p>
      </div>

      <div className="flex-shrink-0">
        <BuildingOfficeIcon className="h-8 w-8 text-blue-600 group-hover:text-blue-400 transition-colors group-hover:text-gray-600" />
      </div>
    </li>
  );
}