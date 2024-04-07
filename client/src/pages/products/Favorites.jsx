import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="mx-auto md:ml-[10rem]">
      <h1 className="text-sm md:text-lg font-bold md:ml-[3rem] text-center md:text-start mt-[1rem] md:mt-[3rem]">
        FAVORITE PRODUCTS
      </h1>

      <div className="flex justify-center items-center flex-wrap">
        {favorites.length > 0 ? (
          favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <p className="text-center">No favorite products yet</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
