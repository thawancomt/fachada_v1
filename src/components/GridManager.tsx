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

    if (rows <= 0 || columns <= 0) {
        console.error("Invalid grid dimensions. Rows and columns must be greater than 0.");
        return null;
    }

    function initGrid() {
        const options = dbManager.getFacade(facadeName || "Bloco A Lado Norte");

    }

    useEffect(() => {
        initGrid();
        console.log("Loaded facade: ", facadeName);
        
    }, [facadeName]);

    function getIndex(x: number, y: number): { x: string | number; y: string | number } {
        let temporaryIndex = {
            x: "",
            y: ""
        };

        if (inverseX) {
            temporaryIndex.x = `${inverseX ? columns - x : x + 1}`;
            temporaryIndex.y = `${inverseY ? rows - y : y + 1}`;
        } else if (inverseY) {
            temporaryIndex.y = `${inverseY ? rows - y : y + 1}`;
            temporaryIndex.x = `${inverseX ? columns - x : x + 1}`;
        } else {
            temporaryIndex.y = `${y + 1}`;
            temporaryIndex.x = `${x + 1}`;
        }

        if (onlyNumbersIndex) {
            return reverseIndex ? { x: `${temporaryIndex.y}`, y: `${temporaryIndex.x}` } :
                { x: `${temporaryIndex.x}`, y: `${temporaryIndex.y}` };
        }

        return reverseIndex ? { x: `${Number(temporaryIndex.x)}`, y: `${numberToLetters(Number(temporaryIndex.y), true)}` } :
            { x: `${numberToLetters(Number(temporaryIndex.x), true)}`, y: `${Number(temporaryIndex.y)}` };
    }

    return (
        <div className="" style={
            {
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, auto)`,
                
                gap: "2px",
            }
        }>


            {
                Array.from({ length: rows }, (_, rowIndex) => (
                    Array.from({ length: columns }, (_, columnIndex) => (
                        <Segment
                            gridRepresentation={`${getIndex(rowIndex, columnIndex).x}` + `${getIndex(rowIndex, columnIndex).y}`}
                            facadeName={facadeName || ""}
                            key={`${rowIndex}-${columnIndex}`}
                            index={{ x: rowIndex, y: columnIndex }}
                            allowEdit={allowEdit} />
                    ))
                ))
            }
        </div>
    )
}

export default GridManager;