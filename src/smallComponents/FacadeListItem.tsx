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
        <li className={`group flex items-center justify-between gap-4 bg-gray-800 w-full p-3 rounded-lg border border-gray-700 
            hover:bg-gray-700/80 duration-300 cursor-pointer shadow-sm hover:shadow-md
            hover:border-gray-600 transform transition-all hover:-translate-y-0.5 ${facadeName === contextFacadeName ? 'border border-green-400' : ''}`}
            onClick={onClick}
            >
            
            <div className="flex flex-col gap-1">
                <h2 className="font-bold text-gray-100 truncate text-2xl">{facadeName}</h2>
                <p className="text-sm text-gray-400 font-medium">
                    Peças:
                    <br />
                    <span className='text-sm ml-2'>{grid.rows} linhas x {grid.columns} colunas</span>
                </p>
            </div>

            <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600/80 group-hover:text-blue-400 
                    transition-colors duration-300 transform group-hover:scale-110" />
            </div>
        </li>
    )
}