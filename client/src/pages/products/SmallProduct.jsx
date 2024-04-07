import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  const formattedPrice = product.price.toLocaleString("en-IN", {
    maximumFractionDigits: 2, // Specify the maximum number of decimal places
    style: "currency",
    currency: "INR", // Specify the currency code for Indian Rupees
  });
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="md:h-auto w-[200px]  md:w-[auto] rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {formattedPrice}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
