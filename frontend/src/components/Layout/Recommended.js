import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, notification, Space } from "antd";
import storeItems from "../../data/items.json";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SEED } from "../../env";
import Rating from "../UI/Rating";
import { listRecommendedProducts } from "../../actions/productActions";
import { Rate } from "antd";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
const Context = React.createContext({
  name: "Default",
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

function Recommended() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const idNum = parseInt(id);
  const dispatch = useDispatch();

  const productRecommended = useSelector((state) => state.productRecommended);
  const {
    error: errorRecommended,
    loading: loadingRecommended,
    products: productsRecommended,
  } = productRecommended;

  const productTopRated = useSelector((state) => state.productTopRated);
  const {
    error: errorTopRated,
    loading: loadingTopRated,
    products: productsTopRated,
  } = productTopRated;

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listRecommendedProducts());
  }, [dispatch]);

  const addToCartHandler = () => {
    navigate(`/cart/${idNum}?qty=${qty}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="items-center self-center my-4 text-[#4A1D1F] dark:text-[#FBEDCD] text-lg font-bold">
        RECOMMENDED PRODUCTS
      </div>
      <div className="flex flex-wrap md:px-[160px] gap-0 md:gap-10 justify-around">
        {errorRecommended || productsRecommended.length === 0
          ? productsTopRated.slice(0, 4).map((product) => (
              <section
                key={product._id}
                className="flex flex-col h-[410px] items-center"
              >
                <div className="w-[90px] md:w-[220px] max-w-[220px] flex flex-col text-[15px] font-semibold">
                  <Link
                    to={`/product/${product._id}`}
                    state={{ id: product._id }}
                  >
                    <img
                      src={`${SEED}${product.image}`}
                      className="w-full h-[105px] md:h-[210px] rounded-lg cursor-pointer"
                    />
                  </Link>
                  <Link
                    to={`/product/${product._id}`}
                    className="no-underline"
                    state={{ id: product._id }}
                  >
                    <div className="no-underline dark:text-white text-black mx-2 mt-2 h-[45px] cursor-pointer">
                      {product.name}
                      {product.is_cake && (
                        <div>( {product.min_weight}lb/s )</div>
                      )}
                    </div>
                  </Link>
                  {product.price}
                  <div className="flex justify-center gap-1 mb-3 mt-[15px] border-2 border-[#4A1D1F] p-1 text-sm rounded-lg">
                    {/* <Rating value={product.rating} colors="#f8e825" /> */}

                    {product.rating > 0 ? (
                      <FaStar className="" style={{ color: "#4A1D1F" }} />
                    ) : (
                      <FaRegStar className="" style={{ color: "#4A1D1F" }} />
                    )}

                    <span>{product.rating}</span>
                  </div>
                </div>
              </section>
            ))
          : productsRecommended.map((product) => (
              <section className="flex flex-col h-[320px] items-center bg-white dark:bg-[#222222] shadow-sm">
                <div
                  className="w-[90px] dark:text-white md:w-[240px] flex flex-col text-[15px] font-semibold
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
                  <div className="flex items-center justify-between mx-3 mb-2 mt-[15px] text-xl">
                    {product.is_cake ? (
                      <div className="text-md text-[#4A1D1F] dark:text-[#FBEDCD]">
                        Rs.{product.price}/{product.min_weight}lb
                      </div>
                    ) : (
                      <div className="text-md text-[#4A1D1F] dark:text-[#FBEDCD] ">
                        Rs.{product.price}
                      </div>
                    )}
                    <div className="flex  gap-1 p-1 rounded-lg dark:border-[#FBEDCD] text-sm">
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
                    <p className="no-underline dark:text-white mx-3 text-black h-[45px] cursor-pointer flex justify-start">
                      {product.name}
                    </p>
                  </Link>
                </div>
              </section>
            ))}
      </div>
    </div>
  );
}

// Wrap the Recommended component with the ErrorBoundary
const RecommendedWithErrorBoundary = () => (
  <ErrorBoundary>
    <Recommended />
  </ErrorBoundary>
);

export default RecommendedWithErrorBoundary;
