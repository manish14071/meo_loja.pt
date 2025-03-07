import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery, useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({ keyword: '', pageNumber: '' });
  const { data: filteredProductsData, isLoading: isLoadingFilteredProducts } = useGetFilteredProductsQuery({ checked, radio });

  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (!isLoadingCategories && categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, isLoadingCategories, dispatch]);

  useEffect(() => {
    if (!isLoadingProducts && productsData) {
      dispatch(setProducts(productsData));
    }
  }, [productsData, isLoadingProducts, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!isLoadingFilteredProducts && Array.isArray(filteredProductsData)) {
        const filteredProducts = filteredProductsData.filter((product) => {
          return product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter, 10);
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsData, isLoadingFilteredProducts, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    if (Array.isArray(filteredProductsData)) {
      const productsByBrand = filteredProductsData.filter((product) => product.brand === brand);
      dispatch(setProducts(productsByBrand));
    }
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = Array.isArray(filteredProductsData)
    ? [...new Set(filteredProductsData.map((product) => product.brand).filter((brand) => brand !== undefined))]
    : [];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <div className="flex md:flex-row">
        <div className="bg-[#151515] p-3 mt-2 mb-2">
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c.id} className="mb-2">
                <div className="flex ietms-center mr-4">
                  <input
                    type="checkbox"
                    id="red-checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c.id)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="pink-checkbox" className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Brands</h2>
          <div className="p-5">
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-enter mr-4 mb-5">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="pink-radio" className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Price</h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          <div className="p-5 pt-0">
            <button className="w-full border my-4" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
        </div>

        <div className="p-3">
          <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
          <div className="flex flex-wrap">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products.map((product) => (
                <div className="p-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;