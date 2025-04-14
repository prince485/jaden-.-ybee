
import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart as CartIcon, X, Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ShoppingCart: React.FC = () => {
  const { state, removeFromCart, updateQuantity, cartTotal, cartItemsCount } = useShop();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    // We could add a checkout flow here in a real application
    alert("Checkout functionality would be implemented here in a real app!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <CartIcon className="mr-2 h-5 w-5" /> Shopping Cart
            <span className="ml-2 text-sm text-gray-500">({cartItemsCount} items)</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-full">
          {state.cart.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <CartIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900">Your cart is empty</h3>
              <p className="text-gray-500 mt-1">Add some products to your cart</p>
              <Button className="mt-4" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto">
                {state.cart.map((item) => {
                  const product = state.products.find((p) => p.id === item.id);
                  if (!product) return null;

                  return (
                    <div
                      key={item.id}
                      className="flex py-4 border-b last:border-b-0"
                    >
                      <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-gray-500"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-gray-900">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-auto font-medium">
                            ${(product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
