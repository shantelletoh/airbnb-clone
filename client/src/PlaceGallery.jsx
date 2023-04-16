import { useCallback, useEffect, useRef, useState } from "react";
// import SimpleImageSlider from "react-simple-image-slider";

const slideStyles = {
  // width: "100%",
  // height: "100%",
  width: "800px",
  // maxHeight: "600px",
  borderRadius: "10px",
  // backgroundSize: "contain",
  backgroundColor: "gray",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
};

const rightArrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  right: "32px",
  fontSize: "45px",
  color: "#fff",
  zIndex: 1,
  cursor: "pointer",
};

const leftArrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  left: "32px",
  fontSize: "45px",
  color: "#fff",
  zIndex: 1,
  cursor: "pointer",
};

const slidesContainerStyles = {
  display: "flex",
  height: "100%",
  transition: "transform ease-out 0.3s",
};

const slidesContainerOverflowStyles = {
  overflow: "hidden",
  height: "100%",
};

export default function PlaceGallery({ place }) {
  const slides = place.photos.map((photo) => ({
    url: "http://localhost:5000/uploads/" + photo,
  }));

  // const timerRef = useRef(null);
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

  function closeModal() {
    setShowFullImage(false);
  }

  function openModal() {
    setShowFullImage(true);
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const getSlideStylesWithBackground = (slideIndex) => ({
    ...slideStyles,
    backgroundImage: `url(${slides[slideIndex].url})`,
    width: `800px`,
  });
  const getSlidesContainerStylesWithWidth = () => ({
    ...slidesContainerStyles,
    width: 800 * slides.length,
    transform: `translateX(${-(currentIndex * 800)}px)`,
  });

  // useEffect(() => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }
  //   timerRef.current = setTimeout(() => {
  //     goToNext();
  //   }, 2000);

  //   return () => clearTimeout(timerRef.current);
  // }, [goToNext]);

  return (
    <div className="flex">
      <div style={{ width: "800px", height: "600px", margin: "0 auto" }}>
        <div className="h-full relative">
          <div>
            <div onClick={goToPrevious} style={leftArrowStyles}>
              ❰
            </div>
            <div onClick={goToNext} style={rightArrowStyles}>
              ❱
            </div>
          </div>
          <div style={slidesContainerOverflowStyles}>
            <div style={getSlidesContainerStylesWithWidth()}>
              {slides.map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  style={getSlideStylesWithBackground(slideIndex)}
                  className="cursor-pointer"
                  onClick={() => {
                    setShowFullImage(!showFullImage);
                    setFullImageIndex(slideIndex);
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="justify-center flex">
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} onClick={() => goToSlide(slideIndex)}>
                {currentIndex === slideIndex ? (
                  <div className="mt-2 mr-2 cursor-pointer w-3 h-3 rounded-full border border-gray-400"></div>
                ) : (
                  <div className="mt-2 mr-2 cursor-pointer w-3 h-3 bg-gray-400 rounded-full border border-gray-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        {showFullImage ? (
          <div className="w-5/6">
            <div
              className="max-w-full fixed top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-40 flex justify-center items-center z-20"
              onClick={() => {
                // close modal when outside of modal is clicked
                setShowFullImage(false);
              }}
            >
              <div
                onClick={(e) => {
                  // do not close modal if anything inside modal content is clicked
                  e.stopPropagation();
                }}
              >
                <button
                  className="bg-transparent"
                  onClick={() => {
                    setShowFullImage(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <img
                  src={
                    "http://localhost:5000/uploads/" +
                    place.photos[fullImageIndex]
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/* <SimpleImageSlider
        style={{ marginTop: "50px" }}
        width={896}
        height={504}
        images={place.photos.map((photo) => ({
          url: "http://localhost:5000/uploads/" + photo,
        }))}
        showBullets={true}
        showNavs={true}
      /> */}
    </div>
  );
}
