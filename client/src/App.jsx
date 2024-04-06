import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import {
  AdminDashboard,
  Cart,
  CategoryList,
  Favourite,
  Home,
  Login,
  Navigation,
  OrderList,
  ProductList,
  Profile,
  Register,
  Shop,
  UserList,
  UserOrder,
} from "./pages";
import { Layout } from "./components";
import RequireAuth from "./components/RequireAuth";
import { Favorites, ProductDetails } from "./pages/products";
import AdminProductUpdate from "./pages/ProductUpdate";
import AllProducts from "./pages/AllProducts";
import { Order, PlaceOrder, Shipping } from "./pages/orders";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  useEffect(() => {
    async function getStripeApiKey() {
      const { data } = await axios.get("/api/orders/stripeapi");
      // console.log(data.stripeApiKey);
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, []);
  return (
    <>
      <ToastContainer />
      <Navigation />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/user-orders" element={<UserOrder />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          {stripeApiKey && (
            <Route
              path="/order/:id"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Order />
                </Elements>
              }
            />
          )}
          <Route path="/admin" element={<RequireAuth />}>
            <Route path="userlist" element={<UserList />} />
            <Route
              path="product/update/:_id"
              element={<AdminProductUpdate />}
            />
            <Route path="categorylist" element={<CategoryList />} />
            <Route path="allproductslist" element={<AllProducts />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orderlist" element={<OrderList />} />
            <Route path="productlist" element={<ProductList />} />
          </Route>
        </Route>
        <Route path="/favorite" element={<Favorites />} />
        <Route index={true} path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
