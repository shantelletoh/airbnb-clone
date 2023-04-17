import { useCallback, useEffect, useRef, useState } from "react";
// import SimpleImageSlider from "react-simple-image-slider";

const slideStyles = {
  // width: "100%",
  // height: "100%",
  width: "90vh",
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

  // img with background
  // <div
  //   style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
  //   className="fixed top-0 bottom-0 right-0 left-0 h-screen grid place-items-center rounded-2xl bg-center bg-cover duration-500 cursor-pointer"
  //   onClick={() => {
  //     setShowFullImage(!showFullImage);
  //     setFullImageIndex(currentIndex);
  //   }}
  // >
  //   <img
  //     src={"http://localhost:5000/uploads/" + place.photos[fullImageIndex]}
  //     alt=""
  //   />
  //   {/* Left Arrow */}
  // </div>;

  return (
    <>
      <div className="max-w-[1400px] h-[700px] w-full m-auto py-16 px-4 relative group">
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
                <div className="mt-2 mr-2 cursor-pointer w-3 h-3 rounded-full border border-gray-400"></div>
              ) : (
                <div className="mt-2 mr-2 cursor-pointer w-3 h-3 bg-gray-400 rounded-full border border-gray-400"></div>
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
                {/* <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t"> */}
                {/* <h3 className="text-3xl font-semibold">Modal Title</h3> */}
                <button
                  className="mb-3 items-center ml-auto bg-gray-600 rounded-full w-9 h-9 text-white hover:bg-gray-700"
                  onClick={() => setShowFullImage(false)}
                >
                  {/* <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none"> */}
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

                  {/* </span> */}
                </button>
                {/* </div> */}
                {/*body*/}
                <img
                  onClick={(e) => {
                    // do not close modal if anything inside modal content is clicked
                    e.stopPropagation();
                  }}
                  src={
                    "http://localhost:5000/uploads/" +
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
  {
    /* <div> */
  }
  {
    /* {showFullImage ? (
        //  className="fixed top-0 bottom-0 right-0 left-0 max-w-[900px] h-[780px] w-full m-auto py-16 px-4 relative group"
        <div>
          <div
            // className="fixed top-0 bottom-0 right-0 left-0 h-screen grid place-items-center rounded-2xl"
            onClick={() => {
              setShowFullImage(!showFullImage);
              setFullImageIndex(currentIndex);
            }}
          >
            <div className="float-right">
              <img
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src={
                  "http://localhost:5000/uploads/" +
                  place.photos[fullImageIndex]
                }
                alt=""
              />
              <div
                // onClick={prevSlide}
                className="fixed text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-20"
              >
                x
              </div>
            </div>
            {/* Left Arrow */
  }
  {
    /* </div> */
  }
  // </div>
  // ) : // <div className="w-5/6 h-5/6">
  //   <div
  //     className="fixed top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-40 flex justify-center items-center z-20"
  //     onClick={() => {
  //       // close modal when outside of modal is clicked
  //       setShowFullImage(false);
  //     }}
  //   >
  //     <div
  //       className=""
  //       onClick={(e) => {
  //         // do not close modal if anything inside modal content is clicked
  //         e.stopPropagation();
  //       }}
  //     >
  //       <button
  //         className="bg-transparent"
  //         onClick={() => {
  //           setShowFullImage(false);
  //         }}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           viewBox="0 0 24 24"
  //           fill="currentColor"
  //           className="w-8 h-8"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
  //             clipRule="evenodd"
  //           />
  //         </svg>
  //       </button>
  //       <img
  //         src={
  //           "http://localhost:5000/uploads/" +
  //           place.photos[fullImageIndex]
  //         }
  //         alt=""
  //       />
  //     </div>
  //   </div>
  // </div>
  //     null} */}
  //   </>
  // );

  // // const timerRef = useRef(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [showFullImage, setShowFullImage] = useState(false);
  // const [fullImageIndex, setFullImageIndex] = useState(-1);

  // // close image if press escape key
  // useEffect(() => {
  //   const close = (e) => {
  //     if (e.key === "Escape") {
  //       setShowFullImage(false);
  //     }
  //   };
  //   window.addEventListener("keydown", close);
  //   return () => window.removeEventListener("keydown", close);
  // }, [showFullImage]);

  // function closeModal() {
  //   setShowFullImage(false);
  // }

  // function openModal() {
  //   setShowFullImage(true);
  // }

  // const goToPrevious = () => {
  //   const isFirstSlide = currentIndex === 0;
  //   const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
  //   setCurrentIndex(newIndex);
  // };
  // const goToNext = useCallback(() => {
  //   const isLastSlide = currentIndex === slides.length - 1;
  //   const newIndex = isLastSlide ? 0 : currentIndex + 1;
  //   setCurrentIndex(newIndex);
  // }, [currentIndex, slides]);
  // const goToSlide = (slideIndex) => {
  //   setCurrentIndex(slideIndex);
  // };
  // const getSlideStylesWithBackground = (slideIndex) => ({
  //   ...slideStyles,
  //   backgroundImage: `url(${slides[slideIndex].url})`,
  //   width: `90vh`,
  // });
  // const getSlidesContainerStylesWithWidth = () => ({
  //   ...slidesContainerStyles,
  //   width: 90 * slides.length,
  //   transform: `translateX(${-(currentIndex * 90)}vh)`,
  // });

  // // useEffect(() => {
  // //   if (timerRef.current) {
  // //     clearTimeout(timerRef.current);
  // //   }
  // //   timerRef.current = setTimeout(() => {
  // //     goToNext();
  // //   }, 2000);

  // //   return () => clearTimeout(timerRef.current);
  // // }, [goToNext]);

  // return (
  //   <div className="flex">
  //     <div style={{ width: "90vh", height: "600px", margin: "0 auto" }}>
  //       <div className="h-full relative">
  //         <div>
  //           <div onClick={goToPrevious} style={leftArrowStyles}>
  //             ❰
  //           </div>
  //           <div onClick={goToNext} style={rightArrowStyles}>
  //             ❱
  //           </div>
  //         </div>
  //         <div style={slidesContainerOverflowStyles}>
  //           <div style={getSlidesContainerStylesWithWidth()}>
  //             {slides.map((_, slideIndex) => (
  //               <div
  //                 key={slideIndex}
  //                 style={getSlideStylesWithBackground(slideIndex)}
  //                 className="cursor-pointer"
  //                 onClick={() => {
  //                   setShowFullImage(!showFullImage);
  //                   setFullImageIndex(slideIndex);
  //                 }}
  //               ></div>
  //             ))}
  //           </div>
  //         </div>
  //         <div className="justify-center flex">
  //           {slides.map((slide, slideIndex) => (
  //             <div key={slideIndex} onClick={() => goToSlide(slideIndex)}>
  //               {currentIndex === slideIndex ? (
  //                 <div className="mt-2 mr-2 cursor-pointer w-3 h-3 rounded-full border border-gray-400"></div>
  //               ) : (
  //                 <div className="mt-2 mr-2 cursor-pointer w-3 h-3 bg-gray-400 rounded-full border border-gray-400"></div>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>

  //     <div>
  //       {showFullImage ? (
  //         <div className="w-5/6 h-5/6">
  //           <div
  //             className="object-scale-down fixed top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-40 flex justify-center items-center z-20"
  //             onClick={() => {
  //               // close modal when outside of modal is clicked
  //               setShowFullImage(false);
  //             }}
  //           >
  //             <div
  //               className=""
  //               onClick={(e) => {
  //                 // do not close modal if anything inside modal content is clicked
  //                 e.stopPropagation();
  //               }}
  //             >
  //               <button
  //                 className="bg-transparent"
  //                 onClick={() => {
  //                   setShowFullImage(false);
  //                 }}
  //               >
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   viewBox="0 0 24 24"
  //                   fill="currentColor"
  //                   className="w-8 h-8"
  //                 >
  //                   <path
  //                     fillRule="evenodd"
  //                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
  //                     clipRule="evenodd"
  //                   />
  //                 </svg>
  //               </button>
  //               <img
  //                 src={
  //                   "http://localhost:5000/uploads/" +
  //                   place.photos[fullImageIndex]
  //                 }
  //                 alt=""
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       ) : null}
  //     </div>
  //     {/* <SimpleImageSlider
  //       style={{ marginTop: "50px" }}
  //       width={896}
  //       height={504}
  //       images={place.photos.map((photo) => ({
  //         url: "http://localhost:5000/uploads/" + photo,
  //       }))}
  //       showBullets={true}
  //       showNavs={true}
  //     /> */}
  //   </div>
  // );
}
