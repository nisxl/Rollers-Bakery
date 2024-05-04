import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import { SEED } from "../../env";

function CheckOutItem({ id, quantity }) {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const item = products.find((i) => i._id === id);
  if (item == null) return null;

  return (
    <div className="flex gap-4 p-4  text-xl border-b-[1.5px]">
      <div className="flex gap-4">
        <div className="flex gap-4 justify-center mt-2">
          <Form.Check
            type="checkbox"
            id={`default-chechbox`}
            //   label={`default checkbox`}
          />
        </div>
        <Link to={`/product/${item._id}`} state={{ id: item._id }}>
          <img
            className="h-[135px] rounded-md w-[116px]"
            src={`${SEED}${item.image}`}
          />
        </Link>
      </div>
      <div className="flex flex-col gap-6 ">
        <Link
          to={`/product/${item._id}`}
          state={{ id: item._id }}
          className="no-underline"
        >
          <h2 className="text-[18px] text-black">{item.name}</h2>
        </Link>
        <div>
          <div className="text-[16px]">
            Normal Height | Blackforest | 1-tier
          </div>
          <div className="bg-[#FBEDCD] text-[14px] px-3">
            Note: Has choco chips inside
          </div>
        </div>
        <div className="text-[24px]">{item.price}</div>
      </div>
    </div>
  );
}

export default CheckOutItem;
