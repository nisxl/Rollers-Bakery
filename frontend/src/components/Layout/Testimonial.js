import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listTopProducts } from "../../actions/productActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

import "./styles.css";
function Testimonial() {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.productTopRated); //getting this part of the state
  const {
    error: errorTopRated,
    loading: loadingTopRated,
    products: productsTopRated,
  } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <div className="flex flex-col pb-[60px] items-center mt-5">
      <div className="text-[#4A1D1F] text-[16px] dark:text-[#FBEDCD]">
        What Our Customers Say
      </div>
      <section className="flex">
        <div className="flex gap-2 border-2 rounded-lg h-44 py-4">
          <img src="../../images/man.png" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col justify-between">
            <p className="flex flex-col">
              <span>Nischal Maharjan</span>
              <span>Yummy bhaii</span>
            </p>
            <img
              src="../../images/cupcakes.jpg"
              className="h-14 w-14 rounded-md"
            />
          </div>
        </div>
      </section>
      <Swiper
        // slidesPerView={5}
        spaceBetween={5}
        autoplay={{
          delay: 2500,
          // disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        breakpoints={{
          0: {
            slidesPerView: 2,
          },

          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {productsTopRated.map((product) => {
          const { reviews } = product;
          if (reviews.length > 0) {
            const review = reviews[0];
            return (
              <SwiperSlide
                key={product._id}
                className="dark:bg-[#222222] dark:text-white"
              >
                <div className="flex justify-start gap-2 border-2 rounded-lg h-56 py-4">
                  <img
                    src="../../images/man.png"
                    className="w-10 h-10 rounded-full"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "999px",
                    }}
                  />
                  <div className="flex flex-col justify-start items-start">
                    <p className="flex flex-col">
                      <span>{review.name}</span>
                      <span className="text-sm h-[4.5em] overflow-hidden w-[250px]">
                        {review.comment}
                      </span>
                    </p>
                    <img
                      src="../../images/cupcakes.jpg"
                      className="h-14 w-14 rounded-md"
                      style={{
                        height: "56px",
                        width: "56px",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          }
          return null;
        })}
      </Swiper>
      {/* <Swiper
        scrollbar={{
          hide: true,
        }}
        modules={[Autoplay, Navigation, Scrollbar]}
        autoplay={{
          delay: 2500,
          // disableOnInteraction: false,
        }}
        loop={true}
        className="mySwiper"
      >
        {productsTopRated.map((product) => {
          const { reviews } = product;
          if (reviews.length > 0) {
            const review = reviews[0]; // Get the first review comment
            return (
              <SwiperSlide key={product._id}>
                <div key={product._id} className="flex flex-col items-center">
                  <p className="flex items-center text-[36px] font-medium">
                    <span className="text-[#FBEDCD] text-[150px] self-start">
                      "{" "}
                    </span>
                    {review.comment}
                    <span className="text-[#FBEDCD] text-[150px] self-end">
                      "
                    </span>
                  </p>

                  <img
                    src="../../images/userp.png"
                    style={{ width: "29px", height: "29px" }}
                  />
                  <div className="text-[#4A1D1F] font-semibold text-[16px] dark:text-[#FBEDCD]">
                    {review.name}
                  </div>
                </div>
              </SwiperSlide>
            );
          }
          return null;
        })}
      </Swiper> */}
    </div>
  );
}

export default Testimonial;
