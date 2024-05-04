import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Message from "../components/UI/Message";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import CartItem from "../components/Cart/cartItem";
function CartPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const navigate = useNavigate();
  const location = useLocation();

  const qty = Number(new URLSearchParams(location.search).get("qty")) || 1;
  // const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  // const weight = location.search
  //   ? Number(location.search.split("&")[1].split("=")[1])
  //   : product.min_weight;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const weighter = useSelector((state) => state.weighter);
  const { weight } = weighter;

  const dispatch = useDispatch();
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
    // 419;
    // navigate("/login?redirect=shipping");
  };

  console.log(qty);
  console.log(weight);

  console.log(cartItems);
  return (
    <Row className="bg-white p-4 rounded-md shadow-md mx-3">
      <Col md={8}>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message vairiant="info" className="mt-4">
            Your cart is empty{" "}
            <Link to="/" className="underline">
              Go Back
            </Link>
          </Message>
        ) : (
          <ListGroup variant="flush" className="mt-4">
            {cartItems.map((item) => (
              <ListGroup.Item
                key={item.product}
                className="px-0 py-2 border-b-2 border-gray-200"
              >
                <Row>
                  <Col md={2}>
                    <Image
                      src={item.image}
                      fluid
                      rounded
                      className="w-16 h-16"
                    />
                  </Col>
                  <Col md={3} className="flex items-center">
                    <Link
                      to={`/product/${item.product}`}
                      className="text-lg font-semibold no-underline hover:underline"
                      style={{ color: "black" }}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2} className="flex items-center">
                    <p className="text-lg font-semibold mt-[10px]">
                      Rs. {item.price}
                    </p>
                  </Col>
                  <Col md={3} className="flex items-center">
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                      className="w-16 h-10 border-2 rounded-md shadow-sm ml-4"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>

                    <p className="text-lg font-semibold ml-4">{item.weight}</p>
                  </Col>

                  <Col md={1} className="flex justify-center items-center">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="mt-4">
          <ListGroup variant="flush">
            <ListGroup.Item className="flex justify-between">
              <h2 className="text-lg font-semibold">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                Items
              </h2>
              <p className="text-lg font-semibold">
                Rs.
                {cartItems
                  .reduce(
                    (acc, item) => (acc + item.qty * item.price * weight) / 2,
                    0
                  )
                  .toFixed(2)}
              </p>
            </ListGroup.Item>
          </ListGroup>

          <ListGroup.Item>
            {userInfo ? (
              <Button
                type="button"
                className="btn btn-primary btn-block mt-4 bg-black"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Message variant="info">
                Please <Link to="/login">Login</Link> to proceed to checkout
              </Message>
            )}
          </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  );
}

export default CartPage;
