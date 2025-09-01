import React from "react";

interface PaginationProps {
  count: number;
  onChange: (newCount: number) => void;
  length: number;
}

const Pagination: React.FC<PaginationProps> = ({ count, onChange, length }) => {
  const handlePrev = () => {
    if (count > 0) onChange(count - 1);
  };

  const handleNext = () => {
    onChange(count + 1);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handlePrev}
        disabled={count === 1}
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span
        className="text-xl font-semibold text-gray-500 cursor-pointer"
        onClick={() => onChange(count)}
      >
        Page No : {count}
      </span>

      <button
        disabled={length < 10}
        onClick={handleNext}
        className={`px-4 py-2  ${length < 10 ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
