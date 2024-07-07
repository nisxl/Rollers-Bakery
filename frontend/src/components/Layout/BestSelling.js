import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/sea-green";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SEED } from "../../env";
import Rating from "../UI/Rating";
import { listTopProducts } from "../../actions/productActions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Context = React.createContext({
  name: "Default",
});

function BestSelling() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const idNum = parseInt(id);

  const dispatch = useDispatch();
  const productTopRated = useSelector((state) => state.productTopRated); //getting this part of the state
  const {
    error: errorTopRated,
    loading: loadingTopRated,
    products: productsTopRated,
  } = productTopRated;

  const addToCartHandler = () => {
    navigate(`/cart/${idNum}?qty=${qty}`);
  };

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <div className="flex flex-wrap px-[160px] gap-10 justify-around ">
      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {productsTopRated.map((product) => (
          <SwiperSlide
            key={product._id}
            className="dark:bg-[#222222] dark:text-white bg-slate-100"
          >
            <section className="flex flex-col h-[410px] items-center dark:bg-[#222222] ">
              <div
                className="w-[90px] dark:text-white md:w-[220px] max-w-[220px] flex flex-col text-[15px] font-semibold
              rounded-lg transition-transform ease-in duration-300 transform hover:scale-105 hover:shadow-lg
              "
              >
                <Link
                  to={`/product/${product._id}`}
                  state={{ id: product._id }}
                >
                  <img
                    src={`${SEED}${product.image}`}
                    className="w-full rounded-t-lg"
                    style={{
                      height: "210px",
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <div className="flex items-center justify-between mx-2">
                  {product.is_cake ? (
                    <div className="text-md text-[#4A1D1F] dark:text-[#FBEDCD]">
                      Rs.{product.price}/{product.min_weight}lb
                    </div>
                  ) : (
                    <div className="text-md text-[#4A1D1F] dark:text-[#FBEDCD]">
                      Rs.{product.price}
                    </div>
                  )}
                  <div className="flex mb-2 mt-[15px] gap-1 p-1 text-sm rounded-lg dark:border-[#FBEDCD]">
                    {/* <Rating value={product.rating} colors="#f8e825" /> */}

                    {product.rating > 0 ? (
                      <FaStar className="" style={{ color: "#fadb14" }} />
                    ) : (
                      <FaRegStar className="" style={{ color: "#fadb14" }} />
                    )}
                    <div>{product.rating}</div>
                  </div>
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="no-underline"
                  state={{ id: product._id }}
                >
                  <p className="no-underline dark:text-white mx-2 text-[#4A1D1F] h-[45px] cursor-pointer flex justify-start">
                    {product.name}
                  </p>
                </Link>

                <div className="flex justify-start mx-2 gap-5 dark:text-[#FBEDCD] text-[#4A1D1F] text-lg pb-5">
                  <ion-icon name="heart-outline"></ion-icon>
                  <ion-icon name="cart-outline"></ion-icon>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default BestSelling;
