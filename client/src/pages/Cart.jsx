import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  addToCart,
  removeFromCart,
  selectCart,
} from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(selectCart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <div className="container   md:justify-around items-start flex wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:w-[80%]">
              <h1 className=" text-xl md:text-2xl font-semibold mb-4">
                Shopping Cart
              </h1>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-center w-full mb-[1rem] pb-2"
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>

                    {/* <div className="mt-2 text-white">{item.brand}</div> */}
                    <div className="mt-2 text-black">{item.brand}</div>

                    <div className="mt-2 text-black font-bold">
                      {" "}
                      {item.price.toLocaleString("en-IN", {
                        maximumFractionDigits: 2, // Specify the maximum number of decimal places
                        style: "currency",
                        currency: "INR", // Specify the currency code for Indian Rupees
                      })}
                    </div>
                  </div>

                  <div className="md:w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 md:mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 md:w-[40rem] mx-auto md:mx-0">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-2xl font-bold">
                    {" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toLocaleString("en-IN", {
                        maximumFractionDigits: 2, // Specify the maximum number of decimal places
                        style: "currency",
                        currency: "INR", // Specify the currency code for Indian Rupees
                      })}
                  </div>

                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
