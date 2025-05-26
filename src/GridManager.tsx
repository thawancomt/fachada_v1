
import { useState } from 'react';
import Segment from './Segment'
import { useGridContext } from './context/GridContext';

interface GridProps {
    facadeName?: string;
    rows: number;
    columns: number;
    useLetter?: boolean;
    reverseVertical?: boolean;
    reverseHorizontal?: boolean;
    prefix?: string;
    suffix?: string;
}



function GridDisplay() {

    const { rows, columns, prefix, reverseVertical, reverseHorizontal, useLetter, suffix } = useGridContext();

    function getIndex(index: number, columns: number) {
        const row = Math.floor(index / columns);
        const column = index % columns;
        return { row, column };
    }

    function getGridRepresentation(row: number, column: number) {

        let rowIndex : string | number = row + 1;
        let columnIndex = column + 1;

        if (reverseVertical) {
            rowIndex = rows  - row;
        }

        if (reverseHorizontal) {
            columnIndex = columns  - column;
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
            // use style to create a Grid
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}>
            {Array.from({ length: rows * columns }).map((_, index) => {
                const { row, column } = getIndex(index, columns);

                return (
                    <div key={`${row}-${column}`} style={{
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Segment
                            gridRepresentation={getGridRepresentation(row, column)}
                            index={{ x: row, y: column }}
                        />
                    </div>
                )
            })}

        </div>
    )

}


function GridManager() {
    const { rows, columns, prefix, setGridOptions } = useGridContext();
    return (
        <>
            <div className='*:bg-amber-300 *:p-2 *:m-2 *:border'>
                <input type="number"  value={rows}
                    onChange={(e) => {
                        setGridOptions((prev) => ({ ...prev, rows: parseInt(e.target.value) }))
                    }}
                /> + 1
                <input type="number" value={columns}
                    onChange={(e) => {
                        setGridOptions((prev) => ({ ...prev, columns: parseInt(e.target.value) }))
                    }}
                />
                <button onClick={() => setGridOptions((prev) => ({ ...prev, useLetter: !prev.useLetter }))}>
                    Toggle Use Letter
                </button>

                <button onClick={() => setGridOptions((prev) => ({ ...prev, reverseVertical: !prev.reverseVertical }))}>
                    Toggle Reverse Vertical
                </button>
                <button onClick={() => setGridOptions((prev) => ({ ...prev, reverseHorizontal: !prev.reverseHorizontal }))}>
                    Toggle Reverse Horizontal
                </button>

                <label htmlFor="">Prefixo</label>
                <input type="text" className="input-control-v1"  value={prefix}
                    onChange={(e) => {
                        setGridOptions((prev) => ({ ...prev, prefix: e.target.value }))
                    }}
                />
            </div>
            <GridDisplay />
        </>
    )
}


export default GridManager;
export { GridManager, GridDisplay };
export type { GridProps };