import { Spin } from "antd";
import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role=" status"
      className="h-[100px] w-[100px] m-auto block"
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}

export default Loader;
