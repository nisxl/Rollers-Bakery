import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Form, Col, Row, ListGroup, Button } from "react-bootstrap";
import { DatePicker } from "antd";
import { SEED } from "../env";
import { useDispatch, useSelector } from "react-redux";
import { Rate, Select } from "antd";
import {
  listProductDetails,
  createProductReview,
  setWeight,
} from "../actions/productActions";
import moment from "moment";
import Loader from "../components/UI/Loader";
import Message from "../components/UI/Message";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Rating from "../components/UI/Rating";
import dayjs from "dayjs";
function ProductPage() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [defWt, setDefWt] = useState(true);
  const [defQt, setDefQt] = useState(true);
  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useCart();

  const { id } = useParams();
  const idNum = parseInt(id);
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [selectedDate, setSelectedDate] = useState("");

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    error: errorProductReview,
    loading: loadingProductReview,
    success: successProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductDetails(idNum));
  }, [dispatch, idNum, successProductReview]);
  const weighter = useSelector((state) => state.weighter);
  const { weight } = weighter;

  useEffect(() => {
    dispatch(setWeight(product.min_weight));
  }, [dispatch, product.min_weight]);

  const [productDesc, setProdDesc] = useState(true);

  const location = useLocation();

  const handleWeightChange = (e) => {
    const newWeight = e.target.value;
    dispatch(setWeight(newWeight));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(idNum, { rating, comment }));
  };

  const addToCartHandler = () => {
    // navigate(`/cart/${idNum}?qty=${qty}`);
    navigate(`/cart/${idNum}?qty=${qty}&weight=${weight}`);
  };
  const handleMessengerClick = () => {
    window.location.href = "https://m.me/113009295084493";
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
    if (product.one_day_cake && currentHour >= 18) {
      return current && current < currentDate.add(2, "day").startOf("day");
    } else if (product.one_day_cake || currentHour >= 14) {
      return current && current < moment().add(1, "day").startOf("day");
    } else {
      return current && current < moment().startOf("day");
    }
  }

  const timeOptions = [
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

  console.log(timeOptions);

  const defaultDate =
    product.one_day_cake && currentHour >= 18
      ? moment(currentDate).add(2, "day").format("YYYY-MM-DD")
      : product.one_day_cake || currentHour >= 14
      ? moment(currentDate).add(1, "day").format("YYYY-MM-DD")
      : moment(currentDate).format("YYYY-MM-DD");

  console.log("current date", defaultDate);

  console.log("selected date", selectedDate);

  return (
    <div>
      <div key={product._id}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="flex gap-[140px]">
            <img
              key={product._id}
              src={`${SEED}${product.image}`}
              className="ml-[120px] w-[400px] h-[450px]"
              alt="product"
            />
            <div className="flex flex-col mt-3 mr-[140px] font-bold">
              <p className="text-[32px] font-bold">{product.name}</p>

              <div className="flex items-center">
                <div className="flex gap-2 items-center mb-3 mt-[20px] ">
                  <Rating value={product.rating} />

                  <span className="border-r-2  pr-3">({product.rating})</span>
                  <div className="pl-3">
                    <span>{product.numReviews}</span>
                  </div>
                </div>
                <div className="flex pl-4 gap-24 items-center">
                  <ion-icon name="heart-outline"></ion-icon>
                </div>
              </div>
              {product.is_cake ? (
                <div className="mt-9">
                  <span className="text-[20px] text-[#4A1D1F]">
                    Base Rate:{" "}
                  </span>
                  Rs.{" "}
                  {(
                    (product.min_weight * product.price) /
                    product.min_weight
                  ).toFixed(2)}
                  /{product.min_weight} lbs
                </div>
              ) : (
                <div className="mt-9">
                  <span className="text-[20px] text-[#4A1D1F]">Rate: </span>
                  Rs. {product.price}
                </div>
              )}
              {(qty !== 1 || weight !== product.min_weight) &&
                product.is_cake && (
                  <div className="mt-9">
                    <span className="text-[20px] text-[#4A1D1F]">Price: </span>
                    Rs.{" "}
                    {(
                      (weight * product.price * Number(qty)) /
                      product.min_weight
                    ).toFixed(2)}
                    /{weight} lbs
                    <span className="text-[12px] font-extralight ml-2">
                      x{qty}
                    </span>
                  </div>
                )}

              {qty !== 1 && !product.is_cake && (
                <div className="mt-9">
                  <span className="text-[20px] text-[#4A1D1F]">Price: </span>
                  Rs. {(product.price * Number(qty)).toFixed(2)}
                  <span className="text-[12px] font-extralight ml-2">
                    x{qty}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-[60px] mx-5">
                {product.is_cake && (
                  <div>
                    <span>Weight</span>
                    <div>
                      <Select
                        value={weight}
                        onChange={(value) => {
                          const newWeight = Number(value);
                          dispatch(setWeight(newWeight));
                        }}
                      >
                        {[
                          ...Array(
                            product.max_weight - product.min_weight + 1
                          ).keys(),
                        ].map((x) => (
                          <Select.Option
                            key={product.max_weight + x}
                            value={product.min_weight + x}
                          >
                            {product.min_weight + x} lbs
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
                {product.countInStock > 0 && (
                  <div>
                    Quantity
                    <div>
                      <Select
                        value={qty}
                        onChange={(value) => {
                          setQty(Number(value));
                          setDefQt(false);
                        }}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <Select.Option key={x + 1} value={x + 1}>
                            {x + 1}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              <DatePicker
                defaultValue={dayjs(defaultDate, "YYYY-MM-DD")}
                disabledDate={disabledDate}
                onChange={onDateChange}
              />
              <Select
                defaultValue="Select Time"
                style={{
                  width: 120,
                }}
                // onChange={handleChange}
                options={timeOptions}
              />
              <div className="flex justify-center">
                {product.countInStock > 0 ? (
                  <div
                    className="flex justify-center mt-[80px] w-[200px] bg-[#4A1D1F] rounded-full py-[6px] text-white cursor-pointer"
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </div>
                ) : (
                  <p className="text-center text-red-500 font-bold">
                    Out of Stock
                  </p>
                )}
              </div>
              <p className="text-[14px] font-light mt-6">
                Order Directly from Messenger:
                <span onClick={handleMessengerClick} className="text-blue-400">
                  Send Message
                </span>
              </p>
              {product.is_cake && (
                <p className="p-2 text-[12px] font-light bg-[#FBEDCD]">
                  This cake requires at least {product.min_weight} lb(s). The
                  price shown above is per lb in base options. The final price
                  might change based on the options you choose.
                </p>
              )}

              {productDesc ? (
                <div className="flex">
                  <p
                    className="flex border-b-2 justify-center cursor-pointer w-[50%]"
                    onClick={() => setProdDesc(true)}
                  >
                    Product Description
                  </p>
                  <p
                    className="flex  border-b justify-center cursor-pointer w-[50%]"
                    onClick={() => setProdDesc(false)}
                  >
                    {" "}
                    Ingredients
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p
                    className="flex border-b justify-center cursor-pointer w-[50%]"
                    onClick={() => setProdDesc(true)}
                  >
                    Product Description
                  </p>
                  <p
                    className="flex border-b-2 justify-center cursor-pointer w-[50%]"
                    onClick={() => setProdDesc(false)}
                  >
                    {" "}
                    Ingredients
                  </p>
                </div>
              )}

              <div>
                {productDesc && (
                  <p className="text-[12px] max-w-[800px] font-light">
                    {product.description}
                  </p>
                )}
                {!productDesc && (
                  <p className="text-[12px] max-w-[800px] font-light">
                    flour, sugar, eggs, baking powder, milk, and oil or butter.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-[50px] ml-[120px]">
        <Row>
          <Col md={6}>
            <div className="reviews-container">
              <h4 className="reviews-heading">Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <div className="review-item">
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />

                      <p className="review-date">
                        {review.createdAt.substring(0, 10)}
                      </p>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <div
                    className="write-review "
                    style={{ border: "1px solid #ccc", padding: "1rem" }}
                  >
                    <h4 className="write-review-heading">Write a review</h4>
                    {loadingProductReview && <Loader />}
                    {successProductReview && (
                      <Message variant="success">Review Submitted</Message>
                    )}

                    {errorProductReview && (
                      <Message variant="danger">{errorProductReview}</Message>
                    )}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <div className="flex flex-col">
                          <Rate value={rating} onChange={setRating} />

                          <Form.Group controlId="comment">
                            <Form.Label>Review</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={7}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="review-textarea"
                            ></Form.Control>
                          </Form.Group>
                          <Row>
                            <Col md={{ span: 6, offset: 6 }}>
                              <Button
                                style={{
                                  backgroundColor: "#4A1D1F",
                                }}
                                className="submit-review-btn"
                                disabled={loadingProductReview}
                                type="submit"
                                variant="primary"
                              >
                                Submit
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    ) : (
                      <Message variant="info">
                        Please <Link to="/login">Login</Link> to write a review
                      </Message>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProductPage;
