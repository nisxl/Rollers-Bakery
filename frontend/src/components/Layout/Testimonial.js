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
        <div>
          <img />
          <p>
            <span></span>
            <span></span>
          </p>
        </div>
      </section>
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
