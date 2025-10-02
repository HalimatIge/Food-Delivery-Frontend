import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { API_URL } from '../config/constants';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('guestCart');
      }
    }
  }, []);

  // Save to localStorage whenever cart changes (for guest users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Load user cart from backend when user logs in
  useEffect(() => {
    if (user && user.id) {
      loadUserCart();
    }
  }, [user]);

  const loadUserCart = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/cart/${user.id}`);
     
      
      if (response.data.cart && response.data.cart.length > 0) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      console.error("Failed to load user cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save to backend when cart changes (for logged-in users)
  useEffect(() => {
    if (user && user.id && cartItems.length >= 0) {
      saveUserCart();
    }
  }, [cartItems, user]);

  const saveUserCart = async () => {
    if (!user?.id) return;
    
    try {
      await axios.post(`${API_URL}/api/cart/${user.id}`, {
        cart: cartItems,
      });
  
    } catch (error) {
      console.error("Failed to save cart to backend:", error);
    }
  };

  const addToCart = (foodItem) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === foodItem._id);
      if (exists) {
        return prev.map((item) =>
          item._id === foodItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...foodItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem('guestCart');
    }
  };

  // Merge guest cart with user cart when user logs in
  const mergeCarts = (guestCart, userCart) => {
    const merged = [...userCart];
    
    guestCart.forEach(guestItem => {
      const existingItem = merged.find(item => item._id === guestItem._id);
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        merged.push(guestItem);
      }
    });
    
    return merged;
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};