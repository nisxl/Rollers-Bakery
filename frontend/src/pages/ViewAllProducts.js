import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Pagination } from "antd";
import { SEED } from "../env";
import Rating from "../components/UI/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
const { Search } = Input;
// import SearchBox from "../components/UI/SearchBox";
function ViewAllProducts({ showPagination }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // showPagination = false;
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const idNum = parseInt(id);
  const productList = useSelector((state) => state.productList);
  const { products } = productList;
  const addToCartHandler = () => {
    navigate(`/cart/${idNum}?qty=${qty}`);
  };

  const [searchQuery, setSearchQuery] = useState("");
  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const handleSearch = () => {
    setCurrentPage(1); // Reset pagination to the first page
  };

  const renderProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((product) => (
      <section
        key={product._id}
        className="flex flex-col h-[410px] items-center"
      >
        <div className="w-[180px] flex flex-col text-[15px] font-semibold">
          <Link to={`/product/${product._id}`} state={{ id: product._id }}>
            <img
              src={`${SEED}${product.image}`}
              className="w-[180px] h-[210px] rounded-lg cursor-pointer"
              alt={product.name}
            />
          </Link>
          <Link
            to={`/product/${product._id}`}
            className="no-underline"
            state={{ id: product._id }}
          >
            <p className="no-underline dark:text-white mx-2 mt-2 h-[45px] cursor-pointer">
              {product.name}
              {product.is_cake && <div>( {product.min_weight}lb/s )</div>}
            </p>
          </Link>
          <div className="flex self-center gap-2 mb-3 mt-[20px]">
            <Rating value={product.rating} colors="#f8e825" />
            <span>{product.rating}</span>
          </div>
        </div>
        {product.countInStock > 0 ? (
          <div className="font-mono">
            <Link to={`/product/${product._id}`} state={{ id: product._id }}>
              <Button
                type="primary"
                className="bg-[#FBEDCD] font-semibold text-black"
                // onClick={addToCartHandler}
              >
                + Add to Cart
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-center text-red-500 font-bold">Out of Stock</p>
        )}
      </section>
    ));

  return (
    <div className="bg-neutral-100 relative min-h-screen">
      <img
        src="../images/pasteries.jpg"
        alt="home"
        className=" w-screen h-[300px] object-cover"
      />

      <div className="py-6 bg-white flex flex-col justify-center gap-5 rounded-lg shadow-md p-6 mx-[100px] relative mt-[-40px] font-bold text-xl">
        <span className="self-center ">ALL PRODUCTS</span>
        <div className="flex items-center">
          <Search
            placeholder="Search"
            onSearch={handleSearch}
            style={{
              width: 200,
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
        <div className="mt-5 flex flex-wrap  px-[160px] gap-10 justify-around">
          {renderProducts}

          <div className="w-full flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={products.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showQuickJumper
              className="text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAllProducts;
