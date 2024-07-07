import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../actions/productActions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

const Categories = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  return (
    <div className=" lg:px-[160px] lg:py-[40px]">
      <Swiper
        // slidesPerView={5}
        navigation={true}
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
            slidesPerView: 4,
          },

          768: {
            slidesPerView: 6,
          },
          1024: {
            slidesPerView: 8,
          },
        }}
      >
        {categories.map(
          (category) =>
            category.image && (
              <SwiperSlide
                key={category.id}
                className="flex flex-col dark:bg-[#222222] "
              >
                <div className="cursor-pointer h-24 w-24 p-1 border-2 rounded-full border-black dark:border-[#FBEDCD] flex">
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "999px",
                    }}
                  />
                </div>
                <div className="text-sm">{category.name}</div>
              </SwiperSlide>
            )
        )}
      </Swiper>
    </div>
  );
};

export default Categories;
