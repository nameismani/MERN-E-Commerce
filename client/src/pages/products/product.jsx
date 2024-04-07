import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const formattedPrice = product.price.toLocaleString("en-IN", {
    maximumFractionDigits: 2, // Specify the maximum number of decimal places
    style: "currency",
    currency: "INR", // Specify the currency code for Indian Rupees
  });
  return (
    <div className="md:w-[30rem] mx-auto ml-[1rem] md:ml-[2rem] p-3 relative">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-[320px] md:w-[30rem] rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-sm md:text-lg">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {formattedPrice}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
