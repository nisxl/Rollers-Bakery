import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/UI/Loader";
import Message from "../components/UI/Message";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

function ProductEditPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
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
  console.log("productt", product);
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category ? product.category : "");
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
    console.log("categoyr cha?", category);

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/products/categories/`
        );
        setCategories(data); // Set the fetched categories
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [dispatch, product, productId, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  console.log("categoery ", category);

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

  return (
    <div className="pt-[80px]  text-[#4A1D1F] bg-[#F4F4F2] 2xl:px-[8vw]">
      <Link to="/admin/productlist">Go Back</Link>
      <div className="flex items-center justify-center justify-items-start flex-col gap-[20px] px-[6vw]"></div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <h2 className="text-5xl font-semibold ">Edit Product</h2>
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
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
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
            <Button type="submit">Update</Button>
          </form>
        )}
      </div>
    </div>
  );
}
export default ProductEditPage;
