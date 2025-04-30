import { JSX } from "react";
import Segment from "./Segment";

import { motion } from "framer-motion";
import Cookies from "js-cookie";


interface BuildingDrawProps {
    rows: number;
    columns: number;
    index?: boolean;
    inverseY?: boolean;
    inverseX?: boolean;
    onlyNumbersIndex?: boolean;
}

function BuildingDraw({ rows, columns, index, inverseY, inverseX, onlyNumbersIndex }: BuildingDrawProps) {

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
            {/* each row, "_" means cols vector */ }

            elements.push(
                <div key={`${rowIndex}-${2}`} className="text-center text-xs font-bold text-gray-500">
                    {rowIndex}
                </div>
            )

            row.forEach((_, colIndex) => {


                const indexY = inverseY ? String(rows - rowIndex) : String(rowIndex + 1);

                // if (onlyNumbersIndex) {

                //     const indexX = String(inverseX ? numberToLetters(columns - colIndex - 1) : numberToLetters(colIndex));
                // }

                const indexX = onlyNumbersIndex ?
                    inverseX ? String(columns - colIndex) : String(colIndex + 1) : String(inverseX ?
                        numberToLetters(columns - colIndex - 1) : numberToLetters(colIndex));

                elements.push(
                    <Segment key={`${rowIndex}-${colIndex}`}

                        index={index || onlyNumbersIndex ? String(indexY + "." + indexX) : String(indexX + "." + indexY)}
                        corX={colIndex}
                        corY={rowIndex}

                        applyAllX={(w, h) => {
                            for (let row = 0; row < rows; row++) {
                                for (let col = 0; col < columns; col++) {
                                    if (col === colIndex) {
                                        Cookies.set(`segmentArea:x${row}y${col}`, JSON.stringify({ width: w, height: h }), { expires: 15 });

                                    }
                                }
                            }



                        }}

                        applyAllY={(w, h) => {
                            for (let row = 0; row < columns; row++) {
                                for (let col = 0; col < rows; col++) {
                                    if (row === rowIndex) {
                                        Cookies.set(`segmentArea:x${row}y${col}`, JSON.stringify({ width: w, height: h }), { expires: 15 });

                                    }
                                }
                            }

                        }}
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
                display: "grid",
                gridTemplateColumns: `repeat(${columns + 1}, auto)`,
                gridAutoRows: "auto",
                gap: 2, // sem espaçamento entre os itens
            }}
        >
            {result()}
        </motion.div>
    );
}

export default BuildingDraw;
