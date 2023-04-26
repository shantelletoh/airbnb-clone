import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../Components/AccountNav";
import axios from "axios";
import PlaceImg from "../Components/PlaceImg";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 ? (
          places.map((place) => (
            <Link
              key={place._id}
              to={"/account/places/" + place._id}
              className="mb-5 flex gap-4 bg-gray-200 rounded-md overflow-hidden"
            >
              <div className="w-48 h-36 bg-cover">
                <PlaceImg className="w-full h-full" place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="pt-2 text-xl font-semibold">{place.title}</h2>
                <h2 className="">{place.address}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-xl pt-7">
            You have not hosted any vacation accommodations.
          </div>
        )}
      </div>
    </div>
  );
}
