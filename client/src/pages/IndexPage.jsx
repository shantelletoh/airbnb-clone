import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
      setSearchResult(response.data);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const result = !search
      ? places
      : places.filter((place) =>
          place.title.toLowerCase().includes(search.toLowerCase())
        );
    setSearchResult(result);
    // console.log(result);
  };

  return (
    // <div className="flex flex-auto">
    // <Sidebar />

    // search
    <>
      {/* <div>
        <form className="flex pb-2" onSubmit={handleSearch}>
          <input
            placeholder="Search by Title"
            className="mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>
        {searchResult?.map((place) => (
          <div key={place._id} place={place}>
            {place.title}
          </div>
        ))}
      </div> */}
      <form className="mt-3 flex pt-2 justify-center" onSubmit={handleSearch}>
        <input
          placeholder="Search Places"
          className="placeholder-gray-600 px-4 ml-5 mr-2 w-[70vw] rounded-2xl bg-gray-100 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white p-1.5 rounded-full"
        >
          {/* "primary" color is set up as own custom color in tailwind file */}
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

      <div className="grow ml-5 mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.length > 0 &&
          searchResult?.map((place) => (
            <Link to={"/place/" + place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:5000/uploads/" + place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price}</span> per night
              </div>
            </Link>
          ))}
      </div>
      {/* </div> */}
    </>
  );
}
