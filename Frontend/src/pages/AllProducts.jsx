import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import ProductCart from "../Components/ProductCart";

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  console.log("All Products:",products)

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);
  
  useEffect(() => {
    if (filteredProducts.length > 0) {
      console.log("Sample product data:", filteredProducts[0]);
    }
  }, [filteredProducts]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-start mb-8">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCart 
              key={product._id} 
              product={product} 
              showPrice={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;