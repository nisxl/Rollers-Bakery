import "./App.css";
import HomePage from "./pages/HomePage";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import OrderListPage from "./pages/OrderListPage";
import ProductListPage from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import { CartProvider } from "./context/CartContext";
import ViewAllProducts from "./pages/ViewAllProducts";
import Header from "./components/Layout/Header";
import AboutPage from "./pages/AboutPage";
import { useLocation } from "react-router-dom";
import PasswordResetConfirmPage from "./pages/PasswordResetConfirmPage";
import CakesPage from "./pages/CakesPage";
import NonCakesPage from "./pages/NonCakesPage";
import { BiSun } from "react-icons/bi";
import { BiMoon } from "react-icons/bi";
import ContactUsPage from "./pages/ContactUsPage";
import FAQPage from "./pages/FAQPage";
function App() {
  const location = useLocation();

  // Define an array of paths where Navbar and Footer should not appear
  const excludedPaths = ["/login", "/register"];

  // Check if the current location matches any excluded path

  const shouldHide = excludedPaths.some(
    (path) =>
      typeof location.pathname === "string" && location.pathname.match(path)
  );

  return (
    <div className="App">
      <div>
        {!shouldHide && <Header />}

        <CartProvider>
          <Routes>
            <Route>
              <Route element={<HomePage />} path="/" exact />
            </Route>
            <Route element={<ViewAllProducts />} path="/allproducts" />
            <Route element={<AboutPage />} path="/about" />

            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
            <Route element={<CakesPage />} path="/cakes" />
            <Route element={<NonCakesPage />} path="/noncakes" />
            <Route element={<ContactUsPage />} path="/contact" />
            <Route element={<FAQPage />} path="/faq" />

            <Route element={<ProductPage />} path="/product/:id" />

            <Route element={<ProfilePage />} path="/profile" />

            <Route element={<CartPage />} path="/cart/:id?" />
            <Route element={<ShippingPage />} path="/shipping" />
            <Route element={<PaymentPage />} path="/payment" />
            <Route element={<PlaceOrderPage />} path="/placeorder" />
            <Route element={<OrderPage />} path="/order/:id" />

            <Route element={<UserListPage />} path="/admin/userlist" />
            <Route element={<UserEditPage />} path="/admin/user/:id/edit" />
            <Route
              path="/password-reset-confirm/:uidb64/:token"
              element={<PasswordResetConfirmPage />}
            />

            <Route element={<ProductListPage />} path="/admin/productlist" />
            <Route
              element={<ProductEditPage />}
              path="/admin/product/:id/edit"
            />

            <Route
              element={<ProductCreatePage />}
              path="/admin/product/create"
            />

            <Route element={<OrderListPage />} path="/admin/orderlist" />
          </Routes>
        </CartProvider>
      </div>
    </div>
  );
}

export default App;
