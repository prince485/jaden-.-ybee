
import React from "react";
import { useShop } from "@/context/ShopContext";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * @param {Object} props
 * @param {import('../types/index').Product} props.product
 */
const ProductCard = ({ product }) => {
  const { addToCart, state, removeFromCart, updateQuantity } = useShop();
  
  const cartItem = state.cart.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-600"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-blue-900/30 hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-700 group">
      <div className="relative h-60 overflow-hidden bg-slate-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-2 right-2 bg-blue-600 text-white">{product.category}</Badge>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-medium text-white text-lg mb-1">{product.name}</h3>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-400 font-bold">${product.price.toFixed(2)}</span>
          {renderRating(product.rating)}
        </div>
        <div className="mt-4">
          {!isInCart ? (
            <Button 
              onClick={() => addToCart(product.id)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between border border-slate-700 rounded-md p-1 bg-slate-900">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-700 text-slate-200 hover:bg-slate-700"
                onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-2 font-medium text-white">{cartItem?.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-700 text-slate-200 hover:bg-slate-700"
                onClick={() => updateQuantity(product.id, (cartItem?.quantity || 0) + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
