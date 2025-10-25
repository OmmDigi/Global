import React from "react";
import { useSearchParams } from "react-router";

interface PaginationProps {
  count?: number;
  onChange?: (newCount: number) => void;
  length: number;
}

const Pagination: React.FC<PaginationProps> = ({ count, onChange, length }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handlePrev = () => {
    if (onChange && count) {
      onChange(count - 1);
    } else {
      setSearchParams((prev) => {
        prev.set("page", (currentPage - 1).toString());
        return prev;
      });
    }
  };

  const handleNext = () => {
    if (onChange && count) {
      onChange(count + 1);
    } else {
      setSearchParams((prev) => {
        prev.set("page", (currentPage + 1).toString());
        return prev;
      });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handlePrev}
        disabled={count ? count === 1 : currentPage == 1}
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span
        className="text-xl font-semibold text-gray-500 cursor-pointer"
        // onClick={() => onChange(count)}
      >
        Page No : {count ? count : currentPage}
      </span>

      <button
        disabled={length < 10}
        onClick={handleNext}
        className={`px-4 py-2  ${
          length < 10 ? "bg-gray-500" : "bg-blue-500"
        } text-white rounded`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
