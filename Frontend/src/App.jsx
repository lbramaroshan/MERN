import React from "react";
import Navbar from "./Components/Navbar.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer.jsx";
import { useAppContext } from "./Context/AppContext.jsx";
import Login from "./Components/Login.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import ButtomBanner from "./Components/ButtomBanner.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import SellerLogin from "./Components/Seller/SellerLogin.jsx";
import SellerLayout from "./pages/Seller/SellerLayout.jsx";
import AddProduct from "./pages/Seller/AddProduct.jsx";
import ProductList from "./pages/Seller/ProductList.jsx";
import Orders from "./pages/Seller/Orders.jsx";
//jg
const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div className={!isSellerPath ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ButtomBanner" element={<ButtomBanner />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          <Route 
            path="/seller" 
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;