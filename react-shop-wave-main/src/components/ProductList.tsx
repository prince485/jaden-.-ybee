
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Layers, Star, ShoppingCart, Plus, Minus } from "lucide-react";

type ViewMode = "grid" | "list" | "compact";

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { state, addToCart, updateQuantity } = useShop();
  const { filters } = state;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    const filtered = products.filter((product) => {
      // Filter by category
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }

      // Filter by price range
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Filter by rating
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Products ({filteredProducts.length})</h2>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : "text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : "text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("compact")}
            className={viewMode === "compact" ? "bg-blue-600 hover:bg-blue-700" : "text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-slate-900 rounded-lg">
          <p className="text-slate-400">No products match your filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700 hover:shadow-blue-900/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="sm:w-1/3 h-48 sm:h-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:w-2/3 flex flex-col">
                <div className="flex justify-between">
                  <h3 className="font-medium text-white text-lg mb-1">{product.name}</h3>
                  <Badge className="bg-blue-600 text-white">{product.category}</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-400 font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= Math.round(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-slate-400">({product.rating.toFixed(1)})</span>
                  </div>
                </div>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const cartItem = state.cart.find((item) => item.id === product.id);
            return (
              <div key={product.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:shadow-blue-900/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center p-3 border-b border-slate-700">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded mr-3" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-white truncate">{product.name}</h3>
                    <p className="text-blue-400 font-bold text-sm">${product.price.toFixed(2)}</p>
                  </div>
                  <Button 
                    onClick={() => addToCart(product.id)} 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
