import React, { useContext, useState, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";

const RegisterPage = (location) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);

  const { error, loading, userInfo } = userRegister;
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    if (localStorage.getItem("registerMessage")) {
      setRegisterMessage(localStorage.getItem("registerMessage"));
      localStorage.removeItem("registerMessage");
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password doesnt match");
    } else {
      dispatch(register(name, email, password));
      navigate("/login");
    }
  };
  return (
    <div className="h-[100vh] text-[#4A1D1F] flex bg-[#F4F4F2]">
      <div className="">
        <img
          src="../images/pasteries.jpg"
          className="h-[100%] w-[50vw] object-cover"
        />
      </div>
      <div className="flex items-center justify-center justify-items-start flex-col gap-[20px] px-[6vw]"></div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <h2 className="text-5xl font-semibold ">Register</h2>
        <form
          className="flex flex-col gap-[30px] my-[20px]"
          onSubmit={submitHandler}
        >
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            required
            type="text"
            placeholder="Name"
            name="username"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <button className="w-[440px] h-[50px] bg-[#4A1D1F] flex justify-center items-center text-white text-2xl rounded-[10px]">
            REGISTER
          </button>
        </form>
        {/* <p>Forgot password?</p> */}
        <p className="text-center text-zinc-400 font-thin">
          Have an Account?
          <u>
            <Link to={"/login"}>
              {/* <Link to={redirect ? ` /login?redirect=${redirect}` : "/login"}> */}
              Sign In
            </Link>
          </u>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
