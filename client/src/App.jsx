import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import {
  Cart,
  CategoryList,
  Favourite,
  Home,
  Login,
  Navigation,
  Profile,
  Register,
  Shop,
  UserList,
} from "./pages";
import { Layout } from "./components";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorite" element={<Favourite />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<RequireAuth />}>
            <Route path="userlist" element={<UserList />} />
            <Route path="categorylist" element={<CategoryList />} />
          </Route>
        </Route>
        <Route path="/shop" element={<Shop />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
