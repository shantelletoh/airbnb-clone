import { useCallback, useEffect, useRef, useState } from "react";

export default function PlaceGallery({ place }) {
  const slides = place.photos.map((photo) => ({
    url:
      photo && photo.includes("https://")
        ? photo
        : "https://shantelle-booking-app.onrender.com/uploads/" + photo,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageIndex, setFullImageIndex] = useState(-1);

  // close image if press escape key
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        setShowFullImage(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [showFullImage]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <>
      <div className="max-w-[1400px] h-[700px] w-full m-auto -mt-10 py-16 relative group">
        <div
          style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
          className="w-full h-full rounded-2xl bg-center bg-cover cursor-pointer"
          onClick={() => {
            setShowFullImage(!showFullImage);
            setFullImageIndex(currentIndex);
          }}
        ></div>
        {/* Left Arrow */}
        <div
          onClick={prevSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-7 rounded-full p-2 bg-black/50 hover:bg-black/60 text-white cursor-pointer"
        >
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="fill-white h-6 w-6"
            >
              {/* Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
          }
        </div>
        {/* Right Arrow */}
        <div
          onClick={nextSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-7 rounded-full p-2 bg-black/50 hover:bg-black/60 text-white cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="fill-white h-6 w-6"
          >
            {/* Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </div>
        <div className="flex top-4 justify-center py-2">
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className="text-2xl cursor-pointer"
            >
              {currentIndex === slideIndex ? (
                <div className="-mt-8 mr-2 cursor-pointer bg-white w-3 h-3 rounded-full border border-white"></div>
              ) : (
                <div className="-mt-8 mr-2 cursor-pointer w-3 h-3 bg-gray-400 rounded-full border border-gray-400"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showFullImage ? (
        <>
          <div
            className="justify-center items-center flex fixed inset-0 z-50"
            onClick={() => {
              // close modal when outside of modal is clicked
              setShowFullImage(false);
            }}
          >
            <div className="max-w-[95vw] max-h-[95vh]">
              {/*content*/}
              <div className="relative flex flex-col">
                {/*header*/}
                <button
                  className="mb-3 items-center ml-auto bg-gray-600 rounded-full w-9 h-9 text-white hover:bg-gray-700"
                  onClick={() => setShowFullImage(false)}
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
                {/*body*/}
                <img
                  onClick={(e) => {
                    // do not close modal if anything inside modal content is clicked
                    e.stopPropagation();
                  }}
                  src={
                    place.photos[fullImageIndex] &&
                    place.photos[fullImageIndex].includes("https://")
                      ? place.photos[fullImageIndex]
                      : "https://shantelle-booking-app.onrender.com/uploads/" +
                        place.photos[fullImageIndex]
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
