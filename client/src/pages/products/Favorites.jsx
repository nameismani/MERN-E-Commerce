import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
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
