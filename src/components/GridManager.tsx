import React, { useEffect } from "react";
import Segment from "./Segment";

import numberToLetters from "./utils/numberToLetter";

import { dbManager } from "./utils/dbManager";

interface GridManagerProps {
    rows?: number;
    columns?: number;
    reverseIndex?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
    onlyNumbersIndex?: boolean;
    allowEdit?: boolean;
    facadeName?: string;

}

function GridManager({ rows = 0, columns = 0, reverseIndex, inverseY, inverseX, onlyNumbersIndex, allowEdit, facadeName }: GridManagerProps) {
    useEffect(() => {
        initGrid();
        console.log("Loaded facade: ", facadeName);
    }, [facadeName]);


    const [forceRender, setForceRender] = React.useState(0)

    function reRenderGrid() {
        setForceRender(forceRender + 1);
    }

    if (rows <= 0 || columns <= 0) {
        console.error("Invalid grid dimensions. Rows and columns must be greater than 0.");
        return null;
    }

    function initGrid() {
        const options = dbManager.getFacade(facadeName || "");
    }



    function getIndex(x: number, y: number): { x: string | number; y: string | number } {

        let temp: Record<string, number> = {
            x: x + 1,
            y: y + 1
        }

        if (inverseY) {
            temp = { x: columns - 1 - x, y: temp.y }
        }

        if (inverseX) {
            temp = { x: temp.x, y: rows + 1 - y }
        }

        if (onlyNumbersIndex) {
            temp = { x: temp.x, y: temp.y }
        } else {
            temp = { x: numberToLetters(temp.x - 1), y: temp.y } 
        }

        if (reverseIndex && !onlyNumbersIndex) {
            return { x: temp.y , y: temp.x }
        }

        return temp;
    }

    const Grid = () => {
        return (
            <>
                {Array.from({ length: rows }, (_, rowIndex) => (
                    Array.from({ length: columns }, (_, columnIndex) => (
                        <Segment
                            gridRepresentation={`${getIndex(rowIndex, columnIndex).x}` + " : " + getIndex(rowIndex, columnIndex).y}
                            facadeName={facadeName || ""}
                            key={`${rowIndex}-${columnIndex}`}
                            index={{ x: rowIndex, y: columnIndex }}
                            allowEdit={allowEdit}
                            reRenderGridCallback={reRenderGrid}
                        />
                    ))
                ))

                }
            </>
        )
    }


    return (
        <div className="w-full h-full overflow-auto p-4" style={
            {
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, auto)`,
                gap: "2px",
            }
        }>

            {
                <Grid />
            }
        </div>
    )
}

export default GridManager;