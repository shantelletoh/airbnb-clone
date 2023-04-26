import { Link } from "react-router-dom";

export default function PlacesList({ places }) {
  return (
    <>
      <div className="grow ml-5 mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.map((place) => (
          <Link to={"/place/" + place._id} key={place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://localhost:5000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold">{place.title}</h2>
            <h3 className="text-sm text-gray-500">{place.address}</h3>
            {/* <div>
              {place.perks.map((perk, index) => (
                <p key={perk}>
                  {perk}
                  {index !== place.perks.length - 1 && "/"}
                </p>
              ))}
            </div> */}
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
