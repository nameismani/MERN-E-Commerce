import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

import { ProductCarousel, SmallProduct } from "../pages/products";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden:sm:hidden">
          <div className="grid  md:grid-cols-2">
            {data?.products.length > 0 ? (
              data?.products?.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            ) : (
              <h2>No products available to display</h2>
            )}
          </div>
        </div>
        {/* <ProductCarousel /> */}
      </div>
    </>
  );
};

export default Header;
