import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";

import { Product } from "./products";
import { Header, Loader, Message } from "../components";

const Home = () => {
  let { keyword } = useParams();

  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  console.log(isLoading);
  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <div className="flex justify-center h-screen items-center">
          <Loader />
        </div>
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="md:ml-[20rem] mt-[10rem] text-[1rem] md:text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 md:mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center   items-center flex-wrap mt-[2rem]">
            {data.products.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
