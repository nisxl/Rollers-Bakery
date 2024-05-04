import React from "react";
import { Rate } from "antd";

function Rating({ value, text, color }) {
  let ratingNumber = Number(value); // convert rating to number
  let rate = ratingNumber - Math.floor(ratingNumber);

  if (rate < 0.26) {
    rate = Math.floor(ratingNumber);
  } else if (rate > 0.25 && rate < 0.75) {
    rate = Math.floor(ratingNumber) + 0.5;
  } else {
    rate = Math.round(ratingNumber);
  }
  return (
    <div className="rating">
      <Rate
        className="hidden md:block"
        allowHalf
        defaultValue={rate}
        disabled
      />
      <span>{text && text}</span>
    </div>
  );
}

export default Rating;
