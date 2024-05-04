import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Col } from "react-bootstrap";
import CheckoutSteps from "../components/Layout/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentPage() {
  let navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Khalti");

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CheckoutSteps step1 step2 step3 />
      <div className="mx-auto max-w-md px-6 py-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Payment Method
        </h2>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend" className="block mb-4 text-sm">
              Select Method
            </Form.Label>
            <Col>
              <Form.Check
                type="radio"
                label="Khalti"
                id="khalti"
                name="paymentMethod"
                checked
                className="form-radio text-indigo-600 h-4 w-4 my-2"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
            <Col>
              <Form.Check
                type="radio"
                label="Physical"
                id="Physical"
                name="paymentMethod"
                className="form-radio text-indigo-600 h-4 w-4"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button
            type="submit"
            className="text-white font-semibold h-12 py-2 px-4 rounded-md mt-12 ml-12"
          >
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default PaymentPage;
