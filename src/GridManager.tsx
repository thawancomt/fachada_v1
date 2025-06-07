import React from 'react';
import Segment from './Segment';
import { useGridContext } from './context/GridContext';
import FirstCell from './smallComponents/FirstCell';
import { useFacadeContext } from './context/FacadeContext';


function GridDisplay() {
    const { rows, columns, prefix, reverseVertical, reverseHorizontal, useLetter, suffix, gap } = useGridContext();
    const { data, facadeName, setSideMenuOpen, sideMenuOpen, setCreateNewFacadeMenu } = useFacadeContext();


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

    function getRowDimension(row: number) {
        let totalSize = 0;
        for (let i = 0; i < columns; i++) {
            if (data[row] && data[row][i]) {

                if (data[row][i].isWindows) {
                    continue;
                }

                totalSize += data[row][i].dimension?.width || 100;
            } else {
                totalSize += 100;
            }
        }
        return totalSize;
    }

    function getColumnDimension(column: number) {
        let totalHeight = 0;
        for (let i = 0; i < rows; i++) {
            if (data[i] && data[i][column]) {
                if (data[i][column].isWindows) {
                    continue;
                }
                totalHeight += data[i][column].dimension?.height || 100;
            } else {
                totalHeight += 100;
            }
        }
        return {
            height: totalHeight
        };
    }


    function getMinColumnWidth(col: number): number {
        // This function ensures we get the minimum width for a column
        // based on the minimum segment width on a Column
        return 100;
    }





    return (
        <div
            className='overflow-auto'
            // use style to create a Grid
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns + 1}, auto)`,
                gap: `${gap}px`
            }}>

            {/* Top-left FirstCell (header) */}
            {
                facadeName && <FirstCell />
            }

            {/* Render first row (column headers) */}
            {Array.from({ length: columns }).map((_, colIdx) => {

                const { height } = getColumnDimension(colIdx);
                return (
                    <FirstCell key={`col-header-${colIdx}`} data={`Altura total: ${height}`} />
                )
            })}


            {/* Render grid rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <React.Fragment key={`row-${rowIdx}`}>
                    {/* First cell of the row (row header) */}
                    <FirstCell data={`Largura total ${getRowDimension(rowIdx)}`} />
                    {/* The rest of the row */}
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <Segment
                            key={`${rowIdx}-${colIdx}-cell`}
                            gridRepresentation={getGridRepresentation(rowIdx, colIdx)}
                            index={{ x: rowIdx, y: colIdx }}
                        />
                    ))}
                </React.Fragment>
            ))}

            {
                rows === 0 && columns === 0 && (
                    <div className="col-span-full text-center text-gray-500 p-4 flex  flex-col justify-center items-center h-screen">
                        <p>Abra ou crie uma fachada para começar.</p>
                        <br />
                        <button className='bg-blue-500 text-white py-2 px-4 rounded'
                            onClick={() => {
                                if (sideMenuOpen) {
                                    setCreateNewFacadeMenu(true);
                                } else {
                                    setSideMenuOpen(true);
                                }
                            }
                            }
                        >{sideMenuOpen ? "Criar nova fachada" : "Abrir menu"}</button>
                    </div>
                )
            }
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