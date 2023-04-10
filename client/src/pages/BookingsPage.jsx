import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

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
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div>
              {booking.checkIn} -&gt; {booking.checkOut}
            </div>
          ))}
      </div>
    </div>
  );
}
