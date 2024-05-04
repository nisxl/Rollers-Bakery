import React from "react";

function AboutPage() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          About Us
        </h2>
        <div className="mt-6 text-xl text-gray-500">
          <p>
            At our bakery, we are passionate about creating delicious treats
            that bring joy to people's lives. We use only the finest ingredients
            and traditional baking methods to craft our baked goods with care
            and attention to detail.
          </p>
          <p className="mt-4">
            Our team of expert bakers has years of experience and a deep
            knowledge of the craft, which allows us to create an array of
            mouth-watering treats that are sure to delight your taste buds.
          </p>
          <p className="mt-4">
            Whether you're in the mood for a classic chocolate chip cookie, a
            decadent slice of cake, or a savory quiche, we have something for
            everyone. We also offer gluten-free and vegan options for those with
            dietary restrictions.
          </p>
          <p className="mt-4">
            We believe that good food is meant to be shared and enjoyed with
            loved ones, and we are proud to be a part of your celebrations, big
            and small. Thank you for choosing our bakery and we can't wait to
            bake for you!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
