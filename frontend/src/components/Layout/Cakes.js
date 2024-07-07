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

const Context = React.createContext({
  name: "Default",
});

function Cakes({ _id, name, price, image, rating, is_cake, min_weight }) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const idNum = parseInt(id);
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const addToCartHandler = () => {
    navigate(`/cart/${idNum}?qty=${qty}`);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Cart`,
      description: "Item added to the cart",
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  const quantity = 0;
  const rat = [1, 2, 3, 4, 5];
  const [nischal, setNischal] = useState(false);
  const alertMessage = () => {
    setNischal(!nischal);
  };

  return (
    <section className="flex flex-col h-[410px] items-center">
      <div className="w-[180px] flex flex-col text-[15px] font-semibold">
        <Link to={`/product/${_id}`} state={{ id: _id }}>
          {/* <Link to="/product" state={{ id: props.key }}> */}{" "}
          <img
            src={`${SEED}${image}`}
            className="w-[180px] h-[210px] rounded-lg cursor-pointer"
          />
        </Link>
        <Link
          to={`/product/${_id}`}
          className="no-underline"
          state={{ id: _id }}
        >
          {/* <Link to="/product" state={{ id: props.key }} className="no-underline"> */}
          <div className="no-underline text-black mx-2 mt-2 h-[45px] cursor-pointer">
            {name}
            {is_cake && <div>( {min_weight}lb/s )</div>}
          </div>
        </Link>
        <div className="flex self-center gap-2 mb-3 mt-[20px]">
          <Rating value={rating} colors="#f8e825" />

          <span>{rating}</span>
        </div>
      </div>

      <div className="font-mono">
        {quantity === 0 ? (
          <Context.Provider value={contextValue}>
            {contextHolder}
            <Link
              to={`/product/${_id}`}
              state={{ id: _id }}
              className="no-underline"
            >
              <Button
                type="primary"
                className="bg-[#FBEDCD] font-semibold text-black"
                onClick={addToCartHandler}
              >
                + Add to Cart
              </Button>
            </Link>
          </Context.Provider>
        ) : (
          <div className="flex items-center flex-col gap-[0.5rem]">
            <div
              className="flex items-center justify-center text-[14px]
            gap-[0.5rem]"
            >
              <div
                className="px-[7px] cursor-pointer rounded-md border-[1.5px] border-gray-300"
                // onClick={() => decreaseCartQuantity(_id)}
              >
                -
              </div>
              <div>
                <span className="font-semibold text-[15px]">{quantity} </span>
                in cart
              </div>
              <div
                className="px-[7px] cursor-pointer rounded-md border-[1.5px] border-gray-300"
                // onClick={() => increaseCartQuantity(_id)}
              >
                +
              </div>
            </div>
            <Button
              type="primary"
              className="text-sm bg-[#4A1D1F]"
              // onClick={() => removeFromCart(_id)}
            >
              Remove
            </Button>
          </div>
        )}{" "}
      </div>
    </section>
  );
}

export default Cakes;
