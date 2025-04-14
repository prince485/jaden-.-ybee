
import React from "react";
import { useShop } from "@/context/ShopContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X, Star, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "home", name: "Home & Kitchen" },
];

const ProductFilters: React.FC = () => {
  const { state, setCategory, setPriceRange, setRating, clearFilters } = useShop();
  const { filters } = state;
  const [openFilters, setOpenFilters] = React.useState({
    categories: true,
    price: true,
    rating: true
  });

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  return (
    <div className="space-y-5 p-5 bg-slate-800/90 rounded-xl border border-slate-700 shadow-lg shadow-blue-900/20 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium text-lg text-white">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-4">
        <Collapsible open={openFilters.categories} onOpenChange={(open) => setOpenFilters({...openFilters, categories: open})}>
          <CollapsibleTrigger className="flex justify-between w-full items-center py-2 text-left">
            <h4 className="font-medium text-slate-200">Categories</h4>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFilters.categories ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-left transition-all ${
                  filters.category === category.id 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => setCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-slate-700" />

        <Collapsible open={openFilters.price} onOpenChange={(open) => setOpenFilters({...openFilters, price: open})}>
          <CollapsibleTrigger className="flex justify-between w-full items-center py-2 text-left">
            <h4 className="font-medium text-slate-200">Price Range</h4>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFilters.price ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 px-1">
            <Slider
              defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
              min={0}
              max={200}
              step={10}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="px-2 py-1 bg-blue-900/40 rounded text-blue-300 font-medium">${filters.priceRange[0]}</span>
              <span className="px-2 py-1 bg-blue-900/40 rounded text-blue-300 font-medium">${filters.priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-slate-700" />

        <Collapsible open={openFilters.rating} onOpenChange={(open) => setOpenFilters({...openFilters, rating: open})}>
          <CollapsibleTrigger className="flex justify-between w-full items-center py-2 text-left">
            <h4 className="font-medium text-slate-200">Rating</h4>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFilters.rating ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-1.5">
            {[0, 1, 2, 3, 4].map((rating) => (
              <div
                key={rating}
                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                  filters.rating === rating + 1
                    ? "bg-blue-900/50 text-blue-100"
                    : "hover:bg-slate-700/50"
                }`}
                onClick={() => handleRatingChange(rating + 1)}
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= rating + 1
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-slate-300">& Up</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ProductFilters;
