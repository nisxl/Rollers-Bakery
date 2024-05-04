import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/sea-green";

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
    <div className="flex flex-wrap px-[160px] gap-10 justify-around">
      <Swiper
        slidesPerView={4}
        spaceBetween={35}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {productsTopRated.map((product) => (
          <SwiperSlide key={product._id}>
            <section className="flex flex-col h-[410px] items-center">
              <div className="w-[180px] flex flex-col text-[15px] font-semibold">
                <Link
                  to={`/product/${product._id}`}
                  state={{ id: product._id }}
                >
                  <img
                    src={`${SEED}${product.image}`}
                    style={{
                      width: "180px",
                      height: "210px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  to={`/product/${product._id}`}
                  className="no-underline dark:text-white"
                  state={{ id: product._id }}
                >
                  <div className="no-underline dark:text-white mx-2 mt-2 h-[45px] cursor-pointer">
                    {product.name}{" "}
                    {product.is_cake && <div>( {product.min_weight}lb/s )</div>}
                  </div>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <Rating value={product.rating} colors="#f8e825" />
                  <span>{product.rating}</span>
                </div>
              </div>
              {product.countInStock > 0 ? (
                <div className="font-mono">
                  <Link
                    to={`/product/${product._id}`}
                    className="no-underline dark:text-white"
                    state={{ id: product._id }}
                  >
                    <Button
                      type="primary"
                      className="bg-[#FBEDCD] font-semibold text-black"
                      // onClick={addToCartHandler}
                    >
                      + Add to Cart
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-center text-red-500 font-bold">
                  Out of Stock
                </p>
              )}
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default BestSelling;
