
import React, { useEffect } from "react";
import { products } from "@/data/products";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import ShoppingCart from "@/components/ShoppingCart";
import { useShop } from "@/context/ShopContext";
import { ShoppingBag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { dispatch } = useShop();

  useEffect(() => {
    // Load products into the state
    dispatch({ type: "SET_PRODUCTS", payload: products });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800/90 shadow-lg shadow-blue-900/20 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-blue-400 mr-2" />
            <h1 className="text-xl font-bold text-white">Midnight Market</h1>
          </div>
          <ShoppingCart />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filters toggle */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                  <Filter className="mr-2 h-4 w-4 text-blue-400" /> Show Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[385px] bg-slate-900 border-r-slate-700 p-0">
                <div className="p-4">
                  <ProductFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="lg:sticky lg:top-24">
              <ProductFilters />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:w-3/4">
            <ProductList products={products} />
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 shadow-inner mt-16 border-t border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-slate-400 text-sm">
            © 2025 Midnight Market. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
