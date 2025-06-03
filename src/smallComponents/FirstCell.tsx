type FirstCellProps = {
    index? : { x: number, y: number }
    data?: any

}

export default function FirstCell({ data }: FirstCellProps) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-gray-300 bg-gray-600 p-4 shadow-sm transition-all h-full">
      <span className="text-sm font-semibold text-white truncate">
        {data}
      </span>
    </div>
  );
}
