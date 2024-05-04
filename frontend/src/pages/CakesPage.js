import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Select } from "antd";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Cakes from "../components/Layout/Cakes";
import { listProducts } from "../actions/productActions";
import { Pagination } from "antd";
import { Collapse } from "antd";
import { Input, Radio, Space } from "antd";

const { Option } = Select;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const CakesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [price, setPrice] = useState(1);
  const [applyFilter, setApplyFilter] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState(0);
  const [customMaxPrice, setCustomMaxPrice] = useState(0);
  const { id } = useParams();
  const idNum = parseInt(id);

  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  let keyword = location.search;
  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  const addToCartHandler = () => {
    navigate(`/cart/${idNum}?qty=${qty}`);
  };

  const handleSort = (value) => {
    setSortOrder(value);
  };

  const sortCakes = (cakes, sortOrder) => {
    if (sortOrder === "asc") {
      return cakes
        .filter((cake) => cake.is_cake) // Filter cakes with is_cake attribute set to true
        .sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      return cakes
        .filter((cake) => cake.is_cake) // Filter cakes with is_cake attribute set to true
        .sort((a, b) => b.price - a.price);
    } else {
      return cakes.filter((cake) => cake.is_cake); // Filter cakes with is_cake attribute set to true
    }
  };

  const [priceRange, setPriceRange] = useState("low"); // State to store selected price range

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const priceRanges = [
    { min: 0, max: 50 },
    { min: 0, max: 1099 },
    { min: 1100, max: 1199 },
    { min: 1200, max: 1299 },
    { min: 1300, max: 1499 },
    { min: 1500, max: Infinity },
  ];

  const filteredCakes = () => {
    if (price === 0) return products; // All products

    if (price === 6) {
      // Custom range inputted by the user
      const minPrice = parseFloat(customMinPrice); // Assuming customMinPrice is a state variable containing the user input
      const maxPrice = parseFloat(customMaxPrice); // Assuming customMaxPrice is a state variable containing the user input

      // Filter products within the custom price range
      return products.filter(
        (cake) => cake.price >= minPrice && cake.price <= maxPrice
      );
    }

    // For predefined price ranges
    const selectedRange = priceRanges[price];
    console.log("selected range", selectedRange);

    return products.filter(
      (cake) =>
        cake.price >= selectedRange.min && cake.price <= selectedRange.max
    );
  };
  const filteredProducts = filteredCakes();
  console.log("filtered", filteredProducts);

  const sortedCakes = sortCakes(filteredProducts, sortOrder);

  const PAGE_SIZE = 3;
  const pageCount = Math.ceil(sortedCakes.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedCakes = sortedCakes.slice(start, end);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const cakes = paginatedCakes.map((item, index) => {
    return <Cakes key={index} {...item} />;
  });

  console.log("paginated", sortedCakes);
  const onChange = (key) => {
    console.log(key);
  };

  const onPriceChange = (e) => {
    console.log("radio checked", e.target.value);
    setPrice(e.target.value);
  };

  const onApply = () => {
    setApplyFilter(true);
  };

  const items = [
    {
      key: "1",
      label: "Price",
      children: (
        <Radio.Group onChange={onPriceChange} value={price}>
          <Space direction="vertical">
            <Radio value={0}>All</Radio>
            <Radio value={1}>Upto NPR 1099</Radio>
            <Radio value={2}>NPR 1100 - NPR 1199</Radio>
            <Radio value={3}> NPR 1200 - NPR 1299</Radio>
            <Radio value={4}> NPR 1300 - NPR 1499</Radio>
            <Radio value={5}>NPR 1500 & Above</Radio>

            <Radio value={6}>
              <Input
                style={{
                  width: 80,
                  marginRight: "5px",
                }}
                type="number"
              />
              -
              <Input
                style={{
                  width: 80,
                  marginLeft: "5px",
                }}
                type="number"
              />
            </Radio>
          </Space>
        </Radio.Group>
      ),
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
    },
  ];

  return (
    <div className="bg-neutral-100 min-h-screen">
      <img
        src="../images/pasteries.jpg"
        alt="home"
        className=" w-screen h-[300px] object-cover"
      />
      <div className="flex gap-2 flex-col md:flex-row mx-10">
        <div className="flex flex-col bg-white min-w-[300px]">
          <div className="flex justify-around">
            <div>Filters</div>
            <Button onClick={onApply}>Apply</Button>
          </div>
          <div className="">
            <Collapse
              items={items}
              defaultActiveKey={["1"]}
              onChange={onChange}
              ghost
            />
          </div>
        </div>
        <div className="py-6 bg-neutral-100 flex flex-col justify-center gap-5 w-full shadow-md p-6 font-bold text-xl">
          <span className="self-center">CAKES</span>
          <div className="flex">
            <Select defaultValue="" onChange={handleSort}>
              <Option value="">Sort by price</Option>
              <Option value="asc">Low to High</Option>
              <Option value="desc">High to Low</Option>
            </Select>
          </div>
          <div className="flex flex-wrap px-[160px] justify-around">
            {cakes}
          </div>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={sortedCakes.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CakesPage;
