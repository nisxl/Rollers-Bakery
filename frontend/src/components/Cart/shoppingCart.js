import { useCart } from "../../context/CartContext";
import { Button } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Offcanvas, Stack } from "react-bootstrap";
import CartItem from "./cartItem";
import storeItems from "../../data/items.json";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import { Link } from "react-router-dom";
import { addToCart } from "../../actions/cartActions";
function ShoppingCart({ isOpen }) {
  const { id } = useParams();
  const productId = parseInt(id);
  const location = useLocation();

  const qty = location.search ? location.search.split("=") : 1;

  const { closeCart, cartItems, cartQuantity } = useCart();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  return (
    <div className="">
      <Offcanvas
        show={isOpen}
        className="bg-white"
        onHide={closeCart}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="font-poppins text-lg">Your Cart </span>
            <span className="font-mono text-[#4A1D1F] font-semibold">
              ({cartQuantity})
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={3}>
            {cartItems.map((item, index) => (
              <CartItem key={index} {...item} />
            ))}
            <div className="flex flex-col gap-3 ">
              <div className="px-3 flex justify-between text-[#4A1D1F] font-mono">
                <span>Sub Total </span>
                <span>
                  {/* {cartItems.reduce((total, cartItem) => {
                    const item = products.find((i) => i._id === cartItem.id);
                    return total + (item?.price || 0) * cartItem.quantity;
                  }, 0)} */}
                </span>
              </div>
              <div className="px-[16px] flex justify-between">
                <div
                  onClick={closeCart}
                  className="border-2 border-[#4A1D1F] rounded-full text-[#4A1D1F] py-[6px] px-4 cursor-pointer"
                >
                  Continue Shopping
                </div>

                <Link to={`/cart`}>
                  {/* <Link to="/product" state={{ id: props.key }}> */}{" "}
                  <div
                    onClick={closeCart}
                    className="bg-[#4A1D1F] rounded-full py-[6px] px-4 text-white cursor-pointer"
                  >
                    Check Out
                  </div>
                </Link>
              </div>
            </div>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
export default ShoppingCart;
