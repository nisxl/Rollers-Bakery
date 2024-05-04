import React, { useContext, useState, useEffect } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/UI/Loader";
import Message from "../components/UI/Message";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstant";

const UserEditPage = (location) => {
  const { id } = useParams();
  const userId = parseInt(id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;
  useEffect(() => {
    //if successfully update the user or not

    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, userId, successUpdate, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
  };

  return (
    <div className="pt-[80px] h-[100vh] text-[#4A1D1F] bg-[#F4F4F2] 2xl:px-[8vw]">
      <Link to="/admin/userlist">Go Back</Link>
      <div className="flex items-center justify-center justify-items-start flex-col gap-[20px] px-[6vw]"></div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <h2 className="text-5xl font-semibold ">Edit User</h2>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form
            className="flex flex-col gap-[30px] my-[20px]"
            onSubmit={submitHandler}
          >
            <input
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
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
            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit">Update</Button>
          </form>
        )}
      </div>
    </div>
  );
};
export default UserEditPage;
