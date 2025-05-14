// import React from "react";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
// import toast from "react-hot-toast";
// import axios from "axios";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const navigate = useNavigate();
//   const [user, setUser] = useState(false);
//   const [isSeller, setIsSeller] = useState(false);
//   const [showUserLogin, setShowUserLogin] = useState(false);
//   const [products, setProducts] = useState([]);

//   const [cartItems, setCartItems] = useState({});
//   const [searchQuery, setSearchQuery] = useState({});

//   //fetch seller data
//   const fetchSeller = async () => {
//     try {
//       const { data } = await axios.get("/api/seller/is-auth");
//       if (data.success) {
//         setIsSeller(true);
//       } else {
//         setIsSeller(false);
//       }
//     } catch (error) {
//       setIsSeller(false);
//     }
//   };

//   const fetchProducts = async () => {
//     setProducts(dummyProducts);
//   };

//   const addToCart = (itemId) => {
//     let cartData = structuredClone(cartItems);
//     if (cartData[itemId]) {
//       cartData[itemId] += 1;
//     } else {
//       cartData[itemId] = 1;
//     }
//     setCartItems(cartData);
//     toast.success("Product added to cart");
//   };

//   const updateCartItem = (itemId, quantity) => {
//     let cartData = structuredClone(cartItems);
//     cartData[itemId] = quantity;
//     setCartItems(cartData);
//     toast.success("Product Cart Updated");
//   };

//   const removeFromCart = (itemId) => {
//     let cartData = structuredClone(cartItems);
//     if (cartData[itemId]) {
//       cartData[itemId] -= 1;
//       if (cartData[itemId] === 0) {
//         delete cartData[itemId];
//       }
//     }
//     toast.success("Product removed from cart");
//     setCartItems(cartData);
//   };

//   //   get cart items count
//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const item in cartItems) {
//       totalCount += cartItems[item];
//     }
//     return totalCount;
//   };
//   //   get cart items total price
//   const getCartAmount = () => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//       const product = products.find((product) => product._id === items);
//       let itemInfo = products.find((product) => product._id === items);
//       if (cartItems[items] > 0) {
//         totalAmount += itemInfo.offerPrice * cartItems[items];
//       }
//       return Math.floor(totalAmount * 100) / 100;
//     }
//   };

//   useEffect(() => {
//     fetchSeller();
//     fetchProducts();
//   }, []);
//   const value = {
//     navigate,
//     user,
//     setUser,
//     isSeller,
//     setIsSeller,
//     showUserLogin,
//     setShowUserLogin,
//     products,
//     setProducts,
//     currency,
//     cartItems,
//     setCartItems,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     searchQuery,
//     setSearchQuery,
//     getCartAmount,
//     getCartCount,
//     axios,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   return useContext(AppContext);
// };





import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null); // Changed from false to null for better state representation
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Changed from object to string

  // Fetch seller data
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success || false);
    } catch (error) {
      setIsSeller(false);
      console.error("Error fetching seller data:", error);
    }
  };

  // fetch User Auth status , user data and cart items
   const fetchUser = async () => {
     try {

       const { data } = await axios.get("/api/user/is-auth");
       setUser(data.user);
       setCartItems(data.user.cartItems || {});
     } catch (error) {
       setUser(null);
       setCartItems({});
       console.error("Error fetching user data:", error);
     }
   }



// fetch all products
  const fetchProducts = async () => {
    try {
      // In a real app, you would fetch from API:
      const { data } = await axios.get("/api/product/list");
      setProducts(data.products || []);
      // setProducts(dummyProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      // setProducts(dummyProducts); // Fallback to dummy data
    }
  };


   


  

  const deleteProduct = async (id) => {
    try {
      // In a real app, you would fetch from API:
      const res = await axios.delete(`/api/product/delete/${id}`);
      return res;
    } catch (error) {
      console.error("Error deleting products:", error);
      }
  };

  const addToCart = (itemId) => {
    if (!products.find(p => p._id === itemId)) {
      toast.error("Product not found");
      return;
    }

    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    toast.success("Product added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity < 0) return;
    
    setCartItems(prev => {
      const newCart = { ...prev };
      if (quantity === 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = quantity;
      }
      return newCart;
    });
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[itemId]) {
        newCart[itemId] -= 1;
        if (newCart[itemId] <= 0) {
          delete newCart[itemId];
        }
      }
      return newCart;
    });
    toast.success("Product removed from cart");
  };

  // Get cart items count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  // Get cart items total price
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const product = products.find(p => p._id === itemId);
      if (product && quantity > 0) {
        return total + (product.offerPrice || product.price) * quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    deleteProduct,
    fetchUser,
    fetchSeller
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};