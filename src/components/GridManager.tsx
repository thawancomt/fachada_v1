import React, { useEffect } from "react";
import Segment from "./Segment";

import numberToLetters from "./utils/numberToLetter";

import { dbManager } from "./utils/dbManager";

interface GridManagerProps {
    rows: number;
    columns: number;
    reverseIndex?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
    onlyNumbersIndex?: boolean;
    allowEdit?: boolean;
    facadeName?: string;

}

function GridManager({ rows, columns, reverseIndex, inverseY, inverseX, onlyNumbersIndex, allowEdit, facadeName }: GridManagerProps) {


    function initGrid() {
        const options = dbManager.getFacade(facadeName || "");
        console.log("Options: ", options);
        
    }

    useEffect(() => {
        initGrid();
    }, [facadeName]);

    function getIndex(x: number, y: number) {
        let temporaryIndex = {
            x : "",
            y : ""
        };

        if (inverseX) {
            temporaryIndex.x = `${inverseX ? columns - x  : x + 1}`;
            temporaryIndex.y = `${inverseY ? rows - y  : y + 1}`;
        } else if (inverseY) {
            temporaryIndex.y = `${inverseY ? rows - y  : y + 1}`;
            temporaryIndex.x = `${inverseX ? columns - x  : x + 1}`;
        } else {
            temporaryIndex.y = `${y + 1}`;
            temporaryIndex.x = `${x + 1}`;
        }

        if (onlyNumbersIndex) {
            return reverseIndex ? `${temporaryIndex.y}:${temporaryIndex.x}` : `${temporaryIndex.x}:${temporaryIndex.y}`;
        }

        return reverseIndex ? `${Number(temporaryIndex.x)}:${numberToLetters(Number(temporaryIndex.y), true)}` : `${numberToLetters(Number(temporaryIndex.x), true)}:${Number(temporaryIndex.y)}`;
    }

    return (
        <div className="" style={
            {
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "2px",
            }
        }>


            {
                Array.from({ length: rows }, (_, rowIndex) => (
                    Array.from({ length: columns }, (_, columnIndex) => (
                        <Segment key={`${rowIndex}-${columnIndex}`} index={`${getIndex(columnIndex, rowIndex)}`} corX={rowIndex} corY={columnIndex} allowEdit={allowEdit}/>
                    ))
                ))
            }
        </div>
    )
}

export default GridManager;