import React, { useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { RiDeleteBin4Fill } from "react-icons/ri";
import storeItems from "../../data/items.json";
import { SEED } from "../../env";

import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";

function CartItem({ id, quantity }) {
  const { removeFromCart, increaseCartQuantity, decreaseCartQuantity } =
    useCart();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const item = products.find((i) => i._id === id);
  if (item == null) return null;
  return (
    <Stack
      direction="horizontal"
      gap={2}
      className="flex pb-3  border-b border-[#4A1D1F] justify-center items-center"
    >
      <img
        src={`${SEED}${item.image}`}
        className="w-[82px] h-[102px] object-cover"
      />
      <div className="flex gap-4 flex-col">
        <div className="flex items-center ">
          <div>{item.name}</div>
          <div
            className="cursor-pointer ml-10"
            onClick={() => removeFromCart(item.id)}
          >
            <RiDeleteBin4Fill />
          </div>
        </div>
        <div className="flex justify-between font-mono">
          <div>{item.price * quantity}</div>
          <div className="flex py-1 border-2 border-[#4A1D1F] rounded-xl">
            <div className="flex text-black gap-2 text-[14px]">
              <span
                className="border-r px-2 cursor-pointer"
                onClick={() => decreaseCartQuantity(id)}
              >
                -
              </span>
              <span>{quantity}</span>
              <span
                className="px-2 border-l cursor-pointer"
                onClick={() => increaseCartQuantity(id)}
              >
                +
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <Button onClick={() => removeFromCart(item.id)}>&times;</Button> */}
    </Stack>
  );
}

export default CartItem;
