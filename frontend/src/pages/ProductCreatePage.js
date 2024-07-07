import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/UI/Loader";
import Message from "../components/UI/Message";
import {
  createProduct,
  listProductDetails,
  updateProduct,
} from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
function ProductCreatePage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [isCake, setIsCake] = useState(false);
  const [isOneDay, setIsOneDay] = useState(false);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //   const redirect = location.search ? location.search.split("=")[1] : "/";

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
        is_cake: true,
        one_day_cake: isOneDay,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("product_id", productId);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/products/upload/",
        formData,
        config
      );
      setUploading(false);
      setImage(data);
    } catch (error) {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      const fetchCategories = async () => {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/products/categories/`
        );
        setCategories(data);
      };
      fetchCategories();
    }
  }, [dispatch, navigate, successUpdate]);
  return (
    <div className="pt-[80px]  text-[#4A1D1F] bg-[#F4F4F2] 2xl:px-[8vw]">
      <Link to="/admin/productlist">Go Back</Link>
      <div className="flex items-center justify-center justify-items-start flex-col gap-[20px] px-[6vw]"></div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <h2 className="text-5xl font-semibold ">Create Product</h2>
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
              type="number"
              placeholder="Price"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
            <input
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
              type="text"
              placeholder="Enter Image"
              name="image"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />

            <div className="flex items-center">
              <label>Cake</label> <label>Yes</label>
              <input
                type="radio"
                name="isCake"
                value={true}
                checked={isCake === true}
                onChange={(e) => setIsCake(true)}
              />{" "}
              <label>No</label>
              <input
                type="radio"
                name="isCake"
                value={false}
                checked={isCake === false}
                onChange={(e) => setIsCake(false)}
              />{" "}
            </div>
            {isCake && (
              <div className="flex items-center">
                <label>One Day</label>
                <label>Yes</label>
                <input
                  type="radio"
                  name="isOneDay"
                  value={false}
                  checked={isOneDay === false}
                  onChange={(e) => setIsOneDay(false)}
                />{" "}
                <label>No</label>
                <input
                  type="radio"
                  name="isOneDay"
                  value={true}
                  checked={isOneDay === true}
                  onChange={(e) => setIsOneDay(true)}
                />{" "}
              </div>
            )}
            <input
              type="file"
              custom
              id="image-file"
              label="Choose File"
              onChange={uploadFileHandler}
            />
            {uploading && <Loader />}
            {/* <Form.File
          id="image-file"
          label="Choose File"
          custom
          onChange={uploadFileHandler}
        ></Form.File> */}
            <input
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
              type="text"
              placeholder="Enter Brand"
              name="brand"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
            />
            <input
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
              type="number"
              placeholder="Enter Stock"
              name="stock"
              onChange={(e) => setCountInStock(e.target.value)}
              value={countInStock}
            />
            <select
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              className="w-[440px] shadow-in h-[45px] placeholder-[#4A1D1F] px-[30px]"
              type="text"
              placeholder="Description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <Button type="submit">Create</Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProductCreatePage;
