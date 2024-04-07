import { useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import GooglePayButton from "./GooglePayButton";

const Order = () => {
  const { id: orderId } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const paymentData = {
    amount: Number(order?.totalPrice),
    shipping: {
      name: userInfo?.username,
      address: {
        city: order?.shippingAddress.city,
        postal_code: order?.shippingAddress.postalCode,
        country: order?.shippingAddress.country,
      },
    },
  };
  // const {
  //   data: paypal,
  //   isLoading: loadingPaPal,
  //   error: errorPayPal,
  // } = useGetPaypalClientIdQuery();

  // useEffect(() => {
  //   if (!errorPayPal && !loadingPaPal && paypal.clientId) {
  //     const loadingPaPalScript = async () => {
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": paypal.clientId,
  //           currency: "USD",
  //         },
  //       });
  //       paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  //     };

  //     if (order && !order.isPaid) {
  //       if (!window.paypal) {
  //         loadingPaPalScript();
  //       }
  //     }
  //   }
  // }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;
    try {
      const { data } = await axios.post(
        "https://mern-e-commerce-8xpe.onrender.com/api/orders/payment/process",
        paymentData
      );
      const clientSecret = data.client_secret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: userInfo.name,
            email: userInfo.email,
          },
        },
      });
      console.log(result);

      // console.log(paymentStatus, "PAYMENT STATUS");
      if (result.error) {
        console.log(result.error.message);
        toast.error(result.error.message);

        document.querySelector("#pay_btn").disabled = false;
      } else {
        if ((await result.paymentIntent.status) === "succeeded") {
          toast.success("Payment Success!");

          try {
            await payOrder({ orderId });
            refetch();
            navigate("/shop");
            toast.success("Order is paid");
          } catch (error) {
            toast.error(error?.data?.message || error.message);
          }
          //   order.paymentInfo = {
          //     id: result.paymentIntent.id,
          //     status: result.paymentIntent.status,
          //   };
          //   dispatch(orderCompleted());
          //   dispatch(createOrder(order));

          //   navigate("/order/success");
          // } else {
          //   toast("Please Try again!", {
          //     type: "warning",
          //     position: toast.POSITION.BOTTOM_CENTER,
          //   });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div className="h-screen flex justify-center items-center">
      <Loader />
    </div>
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container mx-atuo w-[90%] flex flex-col ml-[2.3rem] md:ml-[5rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        {item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-center">
                        {(item.qty * item.price).toLocaleString("en-IN", {
                          maximumFractionDigits: 2, // Specify the maximum number of decimal places
                          style: "currency",
                          currency: "INR", // Specify the currency code for Indian Rupees
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-10 w-[90%] block mx-auto">
          <form className="wfull" onSubmit={handleSubmit}>
            <h1 className="mb-4">Card Info</h1>
            <div className="full pr-8  border-slate-300">
              <p className="text-sm md:text-lg text-slate-500 ">
                Please paste the card number below
                <span className="text-red-500"> 4000 0035 6000 0008</span> and
                enter random cv number and expire date
              </p>
              <label
                htmlFor="card_num_field"
                className="text-neutral-800 font-bold text-sm mb-2 block"
              >
                Card Number
              </label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                // options={{
                //   // placeholder: "**** **** **** ****", // Placeholder for card number
                //   value: "4000 0035 6000 0008", // Default card number
                // }}
                // value="400 000 35600 00008"
                className=" h-10 w-full rounded-md border-2 px-4 py-1.5  mb-4"
              />
            </div>

            <div className="full pr-8  border-slate-300">
              <label
                htmlFor="card_exp_field"
                className="text-neutral-800 font-bold text-sm mb-2 block"
              >
                Card Expiry
              </label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="h-10 w-full rounded-md border-2 px-4 py-1.5  mb-4"
              />
            </div>

            <div className="full pr-8  border-slate-300">
              <label
                htmlFor="card_cvc_field"
                className="text-neutral-800 font-bold text-sm mb-2 block"
              >
                Card CVC
              </label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="h-10 w-full rounded-md border-2 px-4 py-1.5  mb-4"
                value=""
              />
            </div>

            <button
              id="pay_btn"
              type="submit"
              className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
            >
              Pay -{" "}
              {order &&
                order.totalPrice.toLocaleString("en-IN", {
                  maximumFractionDigits: 2, // Specify the maximum number of decimal places
                  style: "currency",
                  currency: "INR", // Specify the currency code for Indian Rupees
                })}
            </button>
          </form>

          {/* <GooglePayButton order={order} /> */}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>
            {order.itemsPrice.toLocaleString("en-IN", {
              maximumFractionDigits: 2, // Specify the maximum number of decimal places
              style: "currency",
              currency: "INR", // Specify the currency code for Indian Rupees
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>
            {order.shippingPrice.toLocaleString("en-IN", {
              maximumFractionDigits: 2, // Specify the maximum number of decimal places
              style: "currency",
              currency: "INR", // Specify the currency code for Indian Rupees
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>
            {order.taxPrice.toLocaleString("en-IN", {
              maximumFractionDigits: 2, // Specify the maximum number of decimal places
              style: "currency",
              currency: "INR", // Specify the currency code for Indian Rupees
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>
            {order.totalPrice.toLocaleString("en-IN", {
              maximumFractionDigits: 2, // Specify the maximum number of decimal places
              style: "currency",
              currency: "INR", // Specify the currency code for Indian Rupees
            })}
          </span>
        </div>

        {!order.isPaid && (
          <div>
            {/* {loadingPay && <Loader />}{" "} */}
            {/* {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>payment</div>
              </div>
            )} */}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
