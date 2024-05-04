import React from "react";

function QNAPage() {
  const handleMessengerClick = () => {
    window.location.href = "https://m.me/113009295084493";
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: What are your bakery's working hours?
          </h3>
          <p className="text-gray-700">
            A: We are open from 9am to 7pm Sunday to Friday
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Do you offer custom cake designs?
          </h3>
          <p className="text-gray-700">
            A: Yes, we specialize in custom cake designs. You can provide us
            with your ideas, and our talented bakers will create a unique cake
            for your special occasion.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Can I place an order in advance?
          </h3>
          <p className="text-gray-700">
            A: Absolutely! We accept advance orders to ensure that your desired
            bakery items are prepared and ready for pickup or delivery at your
            preferred time.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Do you offer gluten-free or vegan options?
          </h3>
          <p className="text-gray-700">
            A: Yes, we have a variety of gluten-free and vegan options
            available. Please let us know about your dietary restrictions, and
            we'll be happy to assist you in finding the perfect treats.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: How can I place an order?
          </h3>
          <p className="text-gray-700">
            A: You can place an order through our website by browsing our menu
            and adding items to your cart. Alternatively, you can visit our
            bakery or give us a call to place your order. You can also message
            us on{" "}
            <span
              onClick={handleMessengerClick}
              className="text-blue-400 cursor-pointer"
            >
              Messenger.
            </span>
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Is it possible to customize the flavors of the cupcakes?
          </h3>
          <p className="text-gray-700">
            A: Certainly! We offer a selection of flavors for our cupcakes. You
            can choose your desired flavors when placing an order or inquire
            about the available options.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: What payment methods do you accept?
          </h3>
          <p className="text-gray-700">
            A: We accept various payment methods, including cash, credit/debit
            cards, and online payment options. You can choose your preferred
            payment method during the checkout process.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Can I request a delivery for my order?
          </h3>
          <p className="text-gray-700">
            A: Yes, we offer delivery services within a certain radius of our
            bakery. Additional charges may apply based on the distance. Please
            provide your location details, and we'll confirm if delivery is
            available in your area.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: How far in advance should I place a custom cake order?
          </h3>
          <p className="text-gray-700">
            A: For custom cake orders, we recommend placing your order at least
            3 days in advance. This allows us to allocate the necessary time for
            design and preparation.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            Q: Do you cater for special events and celebrations?
          </h3>
          <p className="text-gray-700">
            A: Absolutely! We provide catering services for a variety of special
            events and celebrations. Whether it's a birthday party, wedding, or
            corporate gathering, we can create a delightful dessert spread for
            your guests.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QNAPage;
