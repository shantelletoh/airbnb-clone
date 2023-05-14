export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <img
      className={className}
      src={
        place.photos[index] && place.photos[index].includes("https://")
          ? place.photos[index]
          : "http://localhost:5000/uploads/" + place.photos[index]
      }
      alt=""
    />
  );
}
