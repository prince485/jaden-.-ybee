
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "@/types";

type CartItem = {
  id: number;
  quantity: number;
};

type ShopState = {
  products: Product[];
  cart: CartItem[];
  filters: {
    category: string;
    priceRange: [number, number];
    rating: number;
  };
};

type ShopAction =
  | { type: "ADD_TO_CART"; payload: { productId: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "SET_RATING"; payload: number }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_PRODUCTS"; payload: Product[] };

const initialState: ShopState = {
  products: [],
  cart: [],
  filters: {
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
  },
};

const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };
    case "ADD_TO_CART": {
      const existingCartItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.productId
      );

      if (existingCartItemIndex !== -1) {
        // Item already in cart, increase quantity
        const updatedCart = [...state.cart];
        updatedCart[existingCartItemIndex] = {
          ...updatedCart[existingCartItemIndex],
          quantity: updatedCart[existingCartItemIndex].quantity + 1,
        };
        return { ...state, cart: updatedCart };
      } else {
        // Add new item to cart
        return {
          ...state,
          cart: [...state.cart, { id: action.payload.productId, quantity: 1 }],
        };
      }
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.productId),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "SET_CATEGORY":
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        filters: { ...state.filters, priceRange: action.payload },
      };
    case "SET_RATING":
      return {
        ...state,
        filters: { ...state.filters, rating: action.payload },
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          category: "all",
          priceRange: [0, 1000],
          rating: 0,
        },
      };
    default:
      return state;
  }
};

type ShopContextType = {
  state: ShopState;
  dispatch: React.Dispatch<ShopAction>;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setRating: (rating: number) => void;
  clearFilters: () => void;
  cartTotal: number;
  cartItemsCount: number;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  useEffect(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        state.cart = parsedCart;
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  // Helper functions for common actions
  const addToCart = (productId: number) => {
    dispatch({ type: "ADD_TO_CART", payload: { productId } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const setCategory = (category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  };

  const setPriceRange = (range: [number, number]) => {
    dispatch({ type: "SET_PRICE_RANGE", payload: range });
  };

  const setRating = (rating: number) => {
    dispatch({ type: "SET_RATING", payload: rating });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  // Calculate cart totals
  const cartItemsCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.cart.reduce((total, item) => {
    const product = state.products.find((p) => p.id === item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <ShopContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCategory,
        setPriceRange,
        setRating,
        clearFilters,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
