import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [messageSeller, setMessageSeller] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <>
      <div className="mt-4 bg-gray-100 -mx-8 px-8 flex items-center justify-center">
        <div className="max-w-[1400px]">
          {/* everything in this tag is a "child" of children, passed to AddressLink component*/}
          <PlaceGallery place={place} />
          <h1 className="text-2xl font-semibold -mt-8">{place.title}</h1>
          <h1 className="text-xl font-semibold text-gray-500">
            ${place.price}
          </h1>
          <AddressLink className="w-fit">{place.address}</AddressLink>{" "}
          <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div>
              {/* Description */}
              <div className="my-4">
                <h2 className="font-semibold text-2xl">Description</h2>
                {place.description}
              </div>
              Check in: {place.checkIn}
              <br />
              Check out: {place.checkOut}
              <br />
              Max number of guests: {place.maxGuests}
            </div>

            <div>
              <BookingWidget place={place} />
            </div>
          </div>
          <div className="-mx-8 px-8 py-8 border-t mb-12">
            <div>
              <h2 className="font-semibold text-2xl">Extra info</h2>
            </div>
            <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
              {place.extraInfo}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white fixed right-0 left-0 mr-auto ml-auto h-[70px] bottom-0">
        <div className="p-3 right-0 left-0 mr-auto ml-auto text-center text-2xl">
          <button
            className="bg-pink-500 text-white hover:bg-pink-600 active:bg-pink font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setMessageSeller(true)}
          >
            Message Seller
          </button>
        </div>
      </footer>

      {messageSeller ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none"
            onClick={() => {
              // close modal when outside of modal is clicked
              setMessageSeller(false);
            }}
          >
            <div
              className="relative w-[700px] my-6 mx-auto max-w-3xl"
              onClick={(e) => {
                // do not close modal if anything inside modal content is clicked
                e.stopPropagation();
              }}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Message Seller</h3>
                  <button
                    className="items-center ml-auto bg-gray-600 rounded-full w-9 h-9 text-white hover:bg-gray-700"
                    onClick={() => setMessageSeller(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 pl-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto">
                  <textarea
                    className="text-slate-500 border-none focus:outline-none text-lg
                    leading-relaxed"
                    placeholder="Enter a message"
                  ></textarea>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setMessageSeller(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setMessageSeller(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
