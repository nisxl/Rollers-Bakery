import React from "react";
import { BiCopyright } from "react-icons/bi";
import { AiOutlinePhone, AiOutlineHome } from "react-icons/ai";
import { Button } from "antd";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-[#FBEDCD] dark:bg-[#4A1D1F] flex flex-col sm:flex-row py-10 dark:text-white">
      <div className="flex flex-col mt-[80px] px-[70px] items-center  ">
        <p className="font-semibold">Stay Connected</p>
        <div className="flex gap-[14px] mb-[57px] text-white">
          <img src="../../images/instagram.png" className="w-[19px]" />
          <img src="../../images/facebook.png" className="w-[19px]" />
          <img src="../../images/tik-tok.png" className="w-[19px]" />
        </div>
        <div className=" items-center text-[14px] hidden md:flex">
          <BiCopyright /> 2024 Rollers Bakery House, All rights reserved.
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center  grow  justify-evenly">
        <div className="flex flex-col gap-3">
          <Link to={`cakes`}>
            <span>Cakes</span>
          </Link>
          <Link to={`contact`}>
            <span>About Us</span>
          </Link>
          <Link to={`faq`}>
            <span>FAQ</span>
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          <Button className="bg-[#4A1D1F] h-[60px] w-[250px] text-white ">
            Events and specials
          </Button>
          <div className="flex flex-col">
            <Link to={`contact`}>
              <span className="self-center mb-[10px] pointer">Contact Us</span>
            </Link>
            <div className="ml-5 flex items-center">
              <AiOutlineHome />
              Rollers Bakery House
            </div>
            <div className="ml-5 flex items-center">
              <AiOutlinePhone />
              9808772881
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
