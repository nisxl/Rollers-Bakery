import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Message from "../components/UI/Message";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";

function CartPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState("");

  const qty = Number(new URLSearchParams(location.search).get("qty")) || 1;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

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
  };

  const hasNonOneDayCake = () => {
    return cartItems.some((item) => !item.one_day_cake);
  };

  useEffect(() => {
    setSelectedDate(defaultDate);
  }, []);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const onDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    console.log(date, dateString);
  };

  function disabledDate(current) {
    if (!hasNonOneDayCake() && currentHour >= 18) {
      return current && current < currentDate.add(2, "day").startOf("day");
    } else if (!hasNonOneDayCake() || currentHour >= 12) {
      return current && current < moment().add(1, "day").startOf("day");
    } else {
      return current && current < moment().startOf("day");
    }
  }

  let timeOptions = [
    {
      value: "10",
      label: "9am - 11am",
    },
    {
      value: "12",
      label: "11am - 1pm",
    },
    {
      value: "14",
      label: "1pm - 3pm",
    },
    {
      value: "16",
      label: "3pm - 5pm",
    },
    {
      value: "18",
      label: "5pm - 7pm",
    },
  ];
  if (selectedDate === moment(currentDate).format("YYYY-MM-DD")) {
    const currentHour = currentDate.getHours();

    // Filter the timeOptions based on the current hour
    timeOptions = timeOptions.filter(
      (option) => parseInt(option.value) > currentHour + 5
    );
  }

  const defaultDate =
    !hasNonOneDayCake() && currentHour >= 18
      ? moment(currentDate).add(2, "day").format("YYYY-MM-DD")
      : !hasNonOneDayCake() || currentHour >= 14
      ? moment(currentDate).add(1, "day").format("YYYY-MM-DD")
      : moment(currentDate).format("YYYY-MM-DD");

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
            <ListGroup.Item>
              <h2>Delivery Date</h2>
              <div className="flex">
                {/* <Form.Label>Select Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  value={deliveryDate}
                  min={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                /> */}

                <DatePicker
                  defaultValue={dayjs(defaultDate, "YYYY-MM-DD")}
                  disabledDate={disabledDate}
                  onChange={onDateChange}
                  style={{ width: "100%", height: "40px", fontSize: "16px" }}
                />

                <Select
                  defaultValue="Select Time"
                  style={{
                    width: 120,
                    height: "40px",
                  }}
                  options={timeOptions}
                />
              </div>

              {hasNonOneDayCake() && (
                <p>
                  Please note that the preparation time may be longer due to the
                  selected products.
                </p>
              )}
            </ListGroup.Item>
            <ListGroup.Item className="flex justify-between">
              <h2 className="text-lg font-semibold">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                Items
              </h2>
              <p className="text-lg font-semibold">
                Rs.
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
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
