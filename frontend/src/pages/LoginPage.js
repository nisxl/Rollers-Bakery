import React, { useContext, useState, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resetPassword } from "../actions/userActions";
import { Button } from "antd";
const LoginPage = (location) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);

  const { error, loading, userInfo } = userLogin;

  const passwordResetState = useSelector((state) => state.passwordReset);
  const {
    loading: resetLoading,
    error: resetError,
    success: resetSuccess,
  } = passwordResetState;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const resetPasswordHandler = () => {
    navigate("/shipping");
    dispatch(resetPassword(email));
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
        <h2 className="text-5xl font-semibold ">LOGIN</h2>
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-[30px] my-[20px] rounded-[20px]"
        >
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path
                    d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 6.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-3.934 3.934a1 1 0 001.414 1.414L10 11.414l3.934 3.934a1 1 0 001.414-1.414L11.414 10l3.934-3.934a1 1 0 000-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          )}

          <button className="w-[440px] h-[50px] bg-[#4A1D1F] flex justify-center text-white items-center text-2xl rounded-[10px]">
            LOG IN
          </button>
        </form>
        <Button onClick={resetPasswordHandler}>Reset Password</Button>
        {resetLoading && <div>Loading...</div>}
        {resetError && <div>{resetError}</div>}
        {resetSuccess && <div>Password reset email sent.</div>}
        <div className="flex flex-col justify-center items-center">
          <p>Forgot password</p>

          <Link to={"/register"}>
            <p>Don't have an account? Sign up.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
