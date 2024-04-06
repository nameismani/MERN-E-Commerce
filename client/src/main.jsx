import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import store from "./redux/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PayPalScriptProvider> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </PayPalScriptProvider> */}
    </Provider>
  </React.StrictMode>
);
