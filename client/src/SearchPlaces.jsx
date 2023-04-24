import { useState } from "react";

export default function SearchPlaces({ setSearch }) {
  const [value, setValue] = useState("");

  return (
    <form className="mt-3 flex pt-2 justify-center">
      <input
        className="placeholder-gray-600 px-4 ml-5 mr-2 w-[70vw] rounded-2xl bg-gray-100 focus:outline-none"
        placeholder="Search"
        onChange={({ currentTarget: input }) => setValue(input.value)}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            e.preventDefault();
            setSearch(value);
          }
        }}
      />
      <button
        className="bg-primary text-white p-1.5 rounded-full"
        onClick={() => setSearch(value)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  );
}
