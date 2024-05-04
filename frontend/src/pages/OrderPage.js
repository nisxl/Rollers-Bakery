import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Message from "../components/UI/Message";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import config from "../components/Khalti/KhaltiConfig";

import {
  createOrder,
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import Loader from "../components/UI/Loader";
import {
  Form,
  Button,
  Row,
  ListGroup,
  Image,
  Card,
  Col,
} from "react-bootstrap";

function OrderPage() {
  const { id } = useParams();
  const orderId = id;
  // const orderId = parseInt(id);

  const [sdkReady, setSdkReady] = useState(false);

  const [khaltiReady, setKhaltiReady] = useState(true);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addKhaltiScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://khalti.com/static/khalti-checkout.js";
    script.async = true;
    script.onload = () => {
      setKhaltiReady(true);
    };
    document.body.appendChild(script);
  };

  let checkout = new KhaltiCheckout(config(dispatch, orderId, order));

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.khalti) {
        addKhaltiScript();
      }
    }
  }, [
    dispatch,
    order,
    orderId,
    successPay,
    successDeliver,
    navigate,
    userInfo,
  ]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const paidHandler = (paymentResult) => {
    dispatch(payOrder(order._id, paymentResult));
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div className="">
      <h1>Order: {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variatnt="flush">
            <ListGroup.Item>
              <h2>shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={"mailto:${order.user.email"}>{order.user.email}</a>
              </p>
              <p>
                <strong>shipping</strong>
                {order.ShippingAddress.address}, {order.ShippingAddress.city}
                {"   "}
                {order.ShippingAddress.postalCode},{"   "}
                {order.ShippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>

                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X Rs. {item.price} = Rs.
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>Rs. {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>Rs. {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>Rs. {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>s

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>Rs. {parseInt(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {khaltiReady && order.paymentMethod === "Khalti" ? (
                    <div className="d-grid gap-2">
                      <Button
                        type="button"
                        disabled={loadingPay}
                        amount={order.totalPrice}
                        onClick={() =>
                          checkout.show({ amount: order.totalPrice * 100 })
                        }
                      >
                        Pay with Khalti
                      </Button>
                    </div>
                  ) : (
                    <div className="center">
                      <h5>Proceed with cash</h5>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}

            {userInfo &&
              userInfo.isAdmin &&
              order.paymentMethod != "Khalti" &&
              !order.isDelivered && (
                <ListGroup.Item
                  type="button"
                  className="btn btn-block"
                  onClick={paidHandler}
                >
                  <Button>Mark as Paid</Button>
                </ListGroup.Item>
              )}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item
                  type="button"
                  className="btn btn-block"
                  onClick={deliverHandler}
                >
                  <Button>Mark as delivered</Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderPage;
