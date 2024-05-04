import React from "react";
import {
  FaPhoneAlt,
  FaFacebookMessenger,
  FaMapMarkerAlt,
} from "react-icons/fa";

function ContactUsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen mt-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="flex items-center mb-4">
        <FaPhoneAlt className="mr-2" />
        <p className="text-lg">Call us at: 9808-772881</p>
      </div>

      <div className="flex items-center mb-4">
        <p className="text-lg">
          <a
            href="https://goo.gl/maps/wjzCgXsUsxBUUaZD6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg no-underline"
            style={{ textDecoration: "none" }}
          >
            <div className="flex flex-col items-center">
              <div className="flex mb-2">
                <FaMapMarkerAlt className="mr-2" />

                <span>Location: Click here to check our location</span>
              </div>

              <img
                src="../../images/rollerslocation.png"
                className="h-[80px] w-[140px]"
              />
            </div>
          </a>
        </p>
      </div>
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6"></div>
        <div className="flex justify-center">
          <button className="bg-yellow-500" />
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Visit us</h2>
            <p className="mb-2">Balkumari Lalitput, Nepal</p>
            <p className="mb-8">Sunday - Friday: 8am - 6pm</p>
            <h2 className="text-xl font-bold mb-2">Connect with us</h2>
            <div className="flex items-center mb-4">
              <FaPhoneAlt className="mr-2" />
              <p className="text-lg">Call us at: 9808-772881</p>
            </div>
            <div className="flex items-center mb-4">
              <svg
                className="h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.383 0 0 5.383 0 12c0 5.523 3.589 10.205 8.551 11.86.624.117.851-.269.851-.601 0-.296-.011-1.078-.016-2.117-3.47.754-4.203-1.672-4.203-1.672-.568-1.447-1.387-1.835-1.387-1.835-1.132-.773.086-.756.086-.756 1.251.088 1.912 1.282 1.912 1.282 1.114 1.904 2.926 1.352 3.637 1.037.113-.805.434-1.352.788-1.663-2.754-.312-5.646-1.377-5.646-6.125 0-1.352.475-2.46 1.261-3.331-.126-.312-.546-1.577.105-3.292 0 0 1.042-.334 3.412 1.274.988-.275 2.047-.412 3.099-.416 1.052.004 2.111.141 3.099.416 2.37-1.608 3.41-1.274 3.41-1.274.652 1.716.232 2.98.114 3.292.787.871 1.26 1.979 1.26 3.331 0 4.763-2.897 5.812-5.659 6.117.444.383.843 1.138.843 2.296 0 1.659-.015 2.992-.015 3.399 0 .334.225.723.859.6C20.413 22.201 24 17.523 24 12c0-6.617-5.383-12-12-12" />
              </svg>
              <p className="text-lg">Email us at: rollersbakery@gmail.com</p>
            </div>
            <div className="flex items-center mb-4">
              <FaFacebookMessenger className="mr-2" />
              <a
                href="https://m.me/113009295084493"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg no-underline"
                style={{ textDecoration: "none" }}
              >
                Message us at: Roller's Bakery
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default ContactUsPage;
