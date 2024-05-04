import React, { useRef } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BestSelling from "./BestSelling";
import Recommended from "./Recommended";
import Testimonial from "./Testimonial";
import { useCart } from "../../context/CartContext";
import { Button, Dropdown, Menu } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import { motion, useInView, useAnimation } from "framer-motion";

import ProductCarousel from "./ProductCarousel";

import Loader from "../UI/Loader";

import Message from "../UI/Message";
import Paginate from "../UI/Paginate";
import SearchBox from "../UI/SearchBox";
function Body() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);
  const { openCart, cartQuantity } = useCart();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  // const limitedProducts = products.slice(0, 5);
  // let keyword = location.search;
  // useEffect(() => {
  //   dispatch(listProducts(keyword));
  // }, [dispatch, keyword]);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/cakes">Cakes</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/noncakes">Non Cakes</Link>
      </Menu.Item>
    </Menu>
  );

  const handleMessengerClick = () => {
    window.location.href = "https://m.me/113009295084493";
  };

  return (
    <div className="dark:bg-black dark:text-white mt-[-2rem]">
      {/* {!keyword && <ProductCarousel />} */}
      <div className="flex">
        <section className="flex flex-col gap-7 m-10">
          <h1 className="text-[#4A1D1F] dark:text-[#FBEDCD] font-[600] text-3xl mt-[126px] dark:">
            <p>Bring You Happiness</p> <p> through a piece of cake</p>
          </h1>
          <h2 className="font-[500] text-[17px] dark:text-white mt-[30px]">
            We make Different type of cakes, chocolates, soft cookies,
            cheesecake pies or anything you want.
          </h2>
          {/* <SearchBox /> */}
          <div className="flex flex-col mt-[7px] mb-[260px] ">
            <div className="flex gap-3 z-0 mb-3">
              <Dropdown overlay={menu} placement="bottomLeft" arrow>
                <Button className="bg-[#4A1D1F] text-white w-[114px]">
                  Categories
                </Button>
              </Dropdown>
              <Link to={"/allproducts"}>
                <Button className="border-2 border-[#4A1D1F] dark:text-[#FBEDCD] bg-transparent text-[#4A1D1F]">
                  See All Items
                </Button>
              </Link>
            </div>

            <div className=" pointer">
              <Button onClick={handleMessengerClick}>
                <span className="dark:text-[#FBEDCD]">
                  Order Directly from Messenger
                </span>
              </Button>
            </div>
          </div>
        </section>
        <img
          src="../../images/birthdaycake.png"
          className="h-[500px] mt-[50px] dark:hidden hidden md:block"
        />
      </div>

      <section>
        <div className="flex flex-col md:flex-row md:mb-10">
          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="w-[35%]  flex justify-end pr-28 self-center dark:text-[#FBEDCD] text-[24px] font-semibold text-[#4A1D1F]"
          >
            Try Our Best Selling
          </motion.div>
          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="w-[65%] text-[16px] px-28 md:border-l-2  border-[#4A1D1F] dark:border-[#FBEDCD]"
          >
            Here’s our best creations that everyone loves. Lightness and
            sweetness of the cake make you want more and more. Start from cake,
            bread and other creations.{" "}
          </motion.div>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div>
            <BestSelling />

            {/* {bestSeller} */}
            {/* <Paginate page={page} pages={pages} keyword={keyword} /> */}
          </div>
        )}
      </section>
      <section className="flex flex-col items-center">
        <Link to="allproducts">
          <Button
            className="flex mt-5 items-center border-2 border-[#4A1D1F] dark:text-[#FBEDCD] dark:border-[#FBEDCD] bg-transparent text-[#4A1D1F] 
        mb-[141px]"
          >
            <span className="mr-1">View More </span>

            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
        <p className="text-[24px] text-[#4A1D1F] dark:text-[#FBEDCD] font-semibold">
          Cake Ordering we make it easy
        </p>
        <p className="mt-[41px] text-[16px] font-semibold">
          Click here to contact us or visit the nearest store to custom order
          the cake
        </p>
        <Link to="contact">
          <Button className="bg-[#4A1D1F] text-[#DAC6C7] w-[114px] mt-[41px] mb-[76px]">
            Contact Us
          </Button>
        </Link>
      </section>
      {/* <div className="flex flex-wrap px-[160px] pt-8 bg-[#FBEDCD] dark:bg-[#4A1D1F] justify-around">
        {recommended}
      </div> */}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-[#FBEDCD] dark:bg-[#4A1D1F]">
          <Recommended />
          {/* <Paginate page={page} pages={pages} keyword={keyword} /> */}
        </div>
      )}

      <Testimonial />
    </div>
  );
}

export default Body;
