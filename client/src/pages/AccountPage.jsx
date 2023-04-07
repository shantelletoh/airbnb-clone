import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";

export default function AccountPage() {
  const { ready, user } = useContext(UserContext);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
    // when refresh, this redirects to login b/c user is not yet available.
    // b/c in UserContext, useEffect is called when UserContext.Provider... is mounted,
    // but it takes a few ms before it returns the data.
    // so in the beginning UserContext.Provider... is rendered with user being null
    // that's why we is an additional state "ready" to prevent this from happening
  }

  function linkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      //   following replaced by if condition above: || (subpage === undefined && type === "profile")) {
      classes += " bg-primary text-white rounded-full";
    }
    return classes;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2">
        <Link className={linkClasses("profile")} to={"/account"}>
          My profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My accommodations
        </Link>
      </nav>
    </div>
  );
}
