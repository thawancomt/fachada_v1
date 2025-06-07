import React from "react";

type FirstCellProps = {
  index?: { x: number, y: number }
  data?: any
  style?: React.CSSProperties;

}

export default function FirstCell({ data, style }: FirstCellProps) {


  const popupDiv = React.useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="flex items-center justify-center rounded-xl border border-gray-300 bg-gray-600 p-4 shadow-sm transition-all h-full"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (popupDiv.current) {
          popupDiv.current.style.left = `${e.clientX + 10}px`;
          popupDiv.current.style.top = `${e.clientY + 10}px`;
        }
      }}

    >
      {isHovered && data &&<div className="p-2 fixed bg-gray-700 rounded-lg text-white text-xs" ref={popupDiv}
      >
        <p>Tamanho total com medidas de Janelas nao incluídas</p>
      </div>}


      <span className="text-sm font-semibold text-white truncate">
        {data}
      </span>
    </div>
  );
}
