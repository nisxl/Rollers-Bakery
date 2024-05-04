import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/Layout/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
function ShippingPage() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  let navigate = useNavigate();

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country })); //going to actions
    navigate("/payment");
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="mx-12 flex flex-col gap-6">
        <CheckoutSteps step1 step2 />
        <h1 className="self-center">Shipping</h1>
        <div>
          <Form
            onSubmit={submitHandler}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Form.Group
              style={{ width: "100%", margin: "10px 0 0 0" }}
              controlId="address"
            >
              <Form.Label>Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter address"
                value={address ? address : ""}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group
              style={{ width: "100%", margin: "10px 0 0 0" }}
              controlId="city"
            >
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter city"
                value={city ? city : ""}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group
              style={{ width: "100%", margin: "10px 0 0 0" }}
              controlId="postalCode"
            >
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter postal code"
                value={postalCode ? postalCode : ""}
                onChange={(e) => setPostalCode(e.target.value)}
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group
              style={{ width: "100%", margin: "10px 0 0 0" }}
              controlId="country"
            >
              <Form.Label>Country</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter country"
                value={country ? country : ""}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="mt-4"
              style={{ width: "50%" }}
            >
              Continue
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ShippingPage;
