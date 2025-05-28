
import Segment from './Segment'
import { useGridContext } from './context/GridContext';
import { useFacadeContext } from './context/FacadeContext';


function GridDisplay() {

    const { rows, columns, prefix, reverseVertical, reverseHorizontal, useLetter, suffix } = useGridContext();
    


    function getIndex(index: number, columns: number) {
        const row = Math.floor(index / columns);
        const column = index % columns;
        return { row, column };
    }

    function getGridRepresentation(row: number, column: number) {

        let rowIndex: string | number = row + 1;
        let columnIndex = column + 1;

        if (reverseVertical) {
            rowIndex = rows - row;
        }

        if (reverseHorizontal) {
            columnIndex = columns - column;
        }
        if (useLetter) {
            rowIndex = String.fromCharCode(65 + row); // 65 is 'A' in ASCII
        }

        if (prefix || suffix) {
            return `${prefix ? prefix : ''}${rowIndex}-${columnIndex}${suffix ? suffix : ''}`;
        }

        return `${rowIndex}-${columnIndex}`;
    }

    return (
        <div
            className='w-full overflow-scroll'
            // use style to create a Grid
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, auto)`,
                gap: "1px"
            }}>
            {Array.from({ length: rows * columns }).map((_, index) => {
                const { row, column } = getIndex(index, columns);

                return (
                    <Segment
                        gridRepresentation={getGridRepresentation(row, column)}
                        index={{ x: row, y: column }}
                    />
                )
            })}

        </div>
    )

}


function GridManager() {
    return (
        <>
            <GridDisplay />
        </>
    )
}


export default GridManager;
export { GridManager, GridDisplay };