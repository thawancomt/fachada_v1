import { JSX } from "react";
import Segment from "./Segment";

import { motion } from "framer-motion";

interface BuildingDrawProps {
    rows: number;
    columns: number;
    index?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
}

function BuildingDraw({ rows, columns, index, inverseY, inverseX }: BuildingDrawProps) {

    const initialGrid = Array.from({ length: rows }, () => Array(columns).fill(null));

    const numberToLetters = (num: number) => {

        let result = '';
        while (num >= 0) {
            result = String.fromCharCode((num % 26) + 65) + result;
            num = Math.floor(num / 26) - 1;
        }
        return result;
    };

    const result = () => {
        const elements: JSX.Element[] = [];

        initialGrid.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                const indexY = String(inverseY ? (rows - rowIndex) : rowIndex + 1);
                const indexX = String(inverseX ? numberToLetters(columns - colIndex - 1) : numberToLetters(colIndex));
                elements.push(
                    <Segment key={`${rowIndex}-${colIndex}`}

                        index={index ? String(indexY + indexX) : String(indexX + indexY)}
                        corX={colIndex}
                        corY={rowIndex}
                        />
                );
            });
        });

        return elements;
    };

    return (
        <motion.div layout
            className="grid gap-1 overflow-auto w-full h-full"
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
        >
            {result()}
        </motion.div>
    );
}

export default BuildingDraw;
