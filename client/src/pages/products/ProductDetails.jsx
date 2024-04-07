import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";

import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { Loader, Message } from "../../components";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product?.products, qty }));
    navigate("/cart");
  };
  const formattedPrice = product?.products.price.toLocaleString("en-IN", {
    maximumFractionDigits: 2, // Specify the maximum number of decimal places
    style: "currency",
    currency: "INR", // Specify the currency code for Indian Rupees
  });
  return (
    <>
      <div>
        <Link
          to="/"
          className=" font-semibold hover:underline ml-[4rem] md:ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[.5rem] md:mt-[2rem] ml-[2.4rem] md:ml-[10rem]">
            <div>
              <img
                src={product?.products?.image}
                alt={product?.products?.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              />
              <HeartIcon product={product?.products} />
            </div>

            <div className="flex flex-col md:justify-between">
              <h2 className="md:text-2xl text-sm   font-semibold">
                {product?.products?.name}
              </h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-sm md:text-lg w-full text-[#B0B0B0]">
                {product?.products?.description}
              </p>

              <p className="text-2xl md:text-5xl my-4 font-extrabold">
                {formattedPrice}
              </p>

              <div className="flex items-center justify-evenly mx-auto w-full md:w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    {product?.products?.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 md:w-[20rem]">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    {moment(product?.products?.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Reviews:{" "}
                    {product?.products?.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Ratings: {rating}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    {product?.products?.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 md:w-[10rem]">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "}
                    {product?.products?.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                {/* <Ratings
                  value={product?.products?.rating}
                  text={`${product?.products?.numReviews} reviews`}
                /> */}

                {product?.products?.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 md:w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(product?.products?.countInStock).keys()].map(
                        (x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product?.products?.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            {/* <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product?.products}
              />
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
