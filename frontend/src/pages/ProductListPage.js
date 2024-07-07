import { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/UI/Loader";
import Message from "../components/UI/Message";
import {
  listProducts,
  deleteProduct,
  createProduct,
  listCategories,
} from "../actions/productActions";
import Paginate from "../components/UI/Paginate";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

import { VscEdit } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
function ProductListPage() {
  const location = useLocation();

  let keyword = location.search;

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();
  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      // navigate(`/admin/product/${createdProduct._id}/edit`);
      navigate(`/admin/product/create`);
    } else {
      dispatch(listProducts(keyword));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = (product) => {
    // dispatch(createProduct());

    navigate(`/admin/product/create`);
  };

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  console.log("categories", categories);

  return (
    <div className="mx-[50px]">
      <Row className="align-items-center">
        <Col>
          <h1 className="mb-4">Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus />
            Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>Rs. {product.price}</td>
                  <td>
                    {categories.find(
                      (category) => category.id === product.category
                    )?.name || ""}
                  </td>
                  <td>{product.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <VscEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <IoMdTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </div>
      )}
    </div>
  );
}

export default ProductListPage;
