import { useState } from "react";

export default function SearchPlaces({ setSearch }) {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        placeholder="Search"
        onChange={({ currentTarget: input }) => setValue(input.value)}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            setSearch(value);
          }
        }}
      />
      <button onClick={() => setSearch(value)}>Search</button>
    </>
  );
}
