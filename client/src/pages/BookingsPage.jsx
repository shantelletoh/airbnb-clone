import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              className="mb-5 flex gap-4 bg-gray-200 rounded-md overflow-hidden"
            >
              <div className="w-48 h-36 bg-cover">
                <PlaceImg className="w-full h-full" place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl font-semibold">{booking.place.title}</h2>
                <div className="text-xl">
                  <BookingDates
                    booking={booking}
                    className="mb-2 mt-4 text-gray-500"
                  />

                  <div className="flex gap-1 pt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span className="text-xl">
                      | Total price: ${booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center pt-7">
            <p className="text-xl">You have no bookings. </p>
            <p className="pt-5">
              <Link className="underline font-bold">Click here</Link> to find
              your perfect stay today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
