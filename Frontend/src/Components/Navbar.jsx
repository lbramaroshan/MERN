import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import Logo from '../assets/logo.png';
import toast from "react-hot-toast";


const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { user, setUser, setShowUserLogin, setSearchQuery, searchQuery ,getCartCount, axios} = useAppContext();
  const Navigate = useNavigate();

  const logOut = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
    Navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
   
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      Navigate("/products");
    }
  }, [searchQuery, Navigate]);;

  return (
    <nav className="flex items-center justify-between pl-2 pr-8 md:pl-18 md:pr-30 py-8 border-b h-20 border-gray-300 bg-white sticky top-0 z-50 shadow-sm">


      <NavLink to="/" className="flex-shrink-0 h-20 w-auto ml-0 md:ml-12 mr- md:mr-8">
        <img src={Logo} alt="logo" className="h-20 p-2" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
        <NavLink to="/" className="text-gray-700 hover:text-primary font-medium text-sm lg:text-base">
          Home
        </NavLink>
        <NavLink to="Products" className="text-gray-700 hover:text-primary font-medium text-sm lg:text-base">
          All Products
        </NavLink>
  
        {/* Search Bar */}
        <div className="hidden xl:flex items-center w-64 border border-gray-300 rounded-full px-4 py-2">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
            type="text"
            placeholder="Search products..."
          />
        </div>

        {/* Cart Icon */}
        <div onClick={()=>Navigate("/cart")} className="relative cursor-pointer group">
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute -top-2 -right-3 text-xs font-semibold text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        {/* User Auth Section */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-medium transition-colors duration-200"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 text-sm font-medium hidden lg:inline-block">
                My Account
              </span>
            </div>

            {open && (
              <ul
                className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md w-48 overflow-hidden z-50"
                ref={(el) => {
                  const handleClickOutside = (event) => {
                    if (el && !el.contains(event.target) && !event.target.closest(".relative")) {
                      setOpen(false);
                    }
                  };
                  document.addEventListener("mousedown", handleClickOutside);
                  return () => document.removeEventListener("mousedown", handleClickOutside);
                }}
              >
                <li
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    Navigate("/my-orders");
                    setOpen(false);
                  }}
                >
                  My Orders
                </li>
                <li
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    logOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center sm:hidden gap-6">
      <div onClick={()=>Navigate("/cart")} className="relative cursor-pointer group">
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute -top-2 -right-3 text-xs font-semibold text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
        
      </div>
   

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-3 px-4 flex flex-col space-y-3 border-t border-gray-200">
          <NavLink to="/" className="py-2 px-3 text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="Products" className="py-2 px-3 text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/my-orders" className="py-2 px-3 text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}

          {/* Mobile Profile */}
          {user && (
            <div className="flex items-center gap-3 mt-3">
              <img src={assets.profile_icon} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
              <span className="text-gray-700 text-sm font-medium">My Account</span>
            </div>
          )}

          {/* Mobile Search */}
          <div className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 mt-2">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
              type="text"
              placeholder="Search products..."
            />
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex space-x-3 mt-3">
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm"
              >
                Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    Navigate("/my-orders");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  Account
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    logOut();
                  }}
                  className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



// 1




// import React, { useEffect, useRef } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { useAppContext } from "../Context/AppContext";
// import Logo from '../assets/logo.png';

// const Navbar = () => {
//   const [open, setOpen] = React.useState(false);
//   const [openDropdown, setOpenDropdown] = React.useState(false);
//   const { user, setUser, setShowUserLogin, setSearchQuery, searchQuery, getCartCount } = useAppContext();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);

//   const logOut = async () => {
//     setUser(null);
//     navigate("/");
//   };

//   useEffect(() => {
//     if (searchQuery.length > 0) {
//       navigate("/products");
//     }
//   }, [searchQuery, navigate]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
//           !event.target.closest('button[aria-label="Menu"]')) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="flex items-center justify-between pl-2 pr-8 md:pl-18 md:pr-30 py-8 border-b h-20 border-gray-300 bg-white sticky top-0 z-50 shadow-sm">
//       <NavLink 
//         to="/" 
//         className="flex-shrink-0 h-20 w-auto ml-0 md:ml-12 mr-0 md:mr-8"
//         onClick={() => setOpen(false)}
//       >
//         <img src={Logo} alt="logo" className="h-20 p-2"  />
//       </NavLink>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
//         <NavLink 
//           to="/" 
//           className="text-gray-700 hover:text-primary font-medium text-sm lg:text-base"
//           activeClassName="text-primary"
//         >
//           Home
//         </NavLink>
//         <NavLink 
//           to="/products" 
//           className="text-gray-700 hover:text-primary font-medium text-sm lg:text-base"
//           activeClassName="text-primary"
//         >
//           All Products
//         </NavLink>
//         <NavLink 
//           to="/contact" 
//           className="text-gray-700 hover:text-primary font-medium text-sm lg:text-base"
//           activeClassName="text-primary"
//         >
//           Contact
//         </NavLink>
        
//         {/* Search Bar */}
//         <div className="hidden xl:flex items-center w-64 border border-gray-300 rounded-full px-4 py-2">
//           <input
//             onChange={(e) => setSearchQuery(e.target.value)}
//             value={searchQuery}
//             className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
//             type="text"
//             placeholder="Search products..."
//           />
//         </div>

//         {/* Cart Icon */}
//         <div 
//           onClick={() => navigate("/cart")} 
//           className="relative cursor-pointer group"
//           aria-label="Cart"
//         >
//           <img
//             src={assets.nav_cart_icon}
//             alt="cart"
//             className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
//           />
//           <span className="absolute -top-2 -right-3 text-xs font-semibold text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
//             {getCartCount()}
//           </span>
//         </div>

//         {/* User Auth Section */}
//         {!user ? (
//           <button
//             onClick={() => setShowUserLogin(true)}
//             className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-medium transition-colors duration-200"
//             aria-label="Login"
//           >
//             Login
//           </button>
//         ) : (
//           <div className="relative" ref={dropdownRef}>
//             <div 
//               className="flex items-center gap-2 cursor-pointer" 
//               onClick={() => setOpenDropdown(!openDropdown)}
//               aria-label="User menu"
//             >
//               <img
//                 src={assets.profile_icon}
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full object-cover"
//               />
//               <span className="text-gray-700 text-sm font-medium hidden lg:inline-block">
//                 My Account
//               </span>
//             </div>

//             {openDropdown && (
//               <ul className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md w-48 overflow-hidden z-50">
//                 <li
//                   className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
//                   onClick={() => {
//                     navigate("/my-orders");
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   My Orders
//                 </li>
//                 <li
//                   className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     logOut();
//                     setOpenDropdown(false);
//                   }}
//                 >
//                   Logout
//                 </li>
//               </ul>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu Button */}
//       <div className="flex items-center md:hidden gap-6">
//         <div 
//           onClick={() => navigate("/cart")} 
//           className="relative cursor-pointer group"
//           aria-label="Cart"
//         >
//           <img
//             src={assets.nav_cart_icon}
//             alt="cart"
//             className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
//           />
//           <span className="absolute -top-2 -right-3 text-xs font-semibold text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
//             {getCartCount()}
//           </span>
//         </div>
//         <button
//           onClick={() => setOpen(!open)}
//           aria-label={open ? "Close menu" : "Open menu"}
//           className="p-2 rounded-md text-gray-700 hover:text-primary"
//         >
//           {open ? (
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div 
//           ref={mobileMenuRef}
//           className="md:hidden fixed top-20 left-0 w-full bg-white shadow-lg py-3 px-4 flex flex-col space-y-3 border-t border-gray-200 z-40"
//         >
//           <NavLink 
//             to="/" 
//             className="py-2 px-3 text-gray-700 hover:bg-gray-100 rounded" 
//             onClick={() => setOpen(false)}
//             activeClassName="bg-gray-100 text-primary"
//           >
//             Home
//           </NavLink>
//           <NavLink 
//             to="/products" 
//             className="py-2 px-3 text-gray-700 hover:bg-gray-100 rounded" 
//             onClick={() => setOpen(false)}
//             activeClassName="bg-gray-100 text-primary"
//           >
//             All Products
//           </NavLink>
//           {user && (
//             <NavLink 
//               to="/my-orders" 
//               className="py-2 px-3 text-gray-700 hover:bg-gray-100 rounded" 
//               onClick={() => setOpen(false)}
//               activeClassName="bg-gray-100 text-primary"
//             >
//               My Orders
//             </NavLink>
//           )}
//           <NavLink 
//             to="/contact" 
//             className="py-2 px-3 text-gray-700 hover:bg-gray-100 rounded" 
//             onClick={() => setOpen(false)}
//             activeClassName="bg-gray-100 text-primary"
//           >
//             Contact
//           </NavLink>

//           {/* Mobile Search */}
//           <div className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 mt-2">
//             <input
//               onChange={(e) => setSearchQuery(e.target.value)}
//               value={searchQuery}
//               className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
//               type="text"
//               placeholder="Search products..."
//             />
//           </div>

//           {/* Mobile Auth Buttons */}
//           <div className="flex space-x-3 mt-3">
//             {!user ? (
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   setShowUserLogin(true);
//                 }}
//                 className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm"
//               >
//                 Sign In
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/my-orders");
//                   }}
//                   className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm"
//                 >
//                   Account
//                 </button>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     logOut();
//                   }}
//                   className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



// import React, { useEffect, useState } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { useAppContext } from "../Context/AppContext";
// import Logo from '../assets/logo.png';
// import LogoDark from '../assets/logo-dark.png'; // Add a dark version of your logo
// import toast from "react-hot-toast";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const { 
//     user, 
//     setUser, 
//     setShowUserLogin, 
//     setSearchQuery, 
//     searchQuery,
//     getCartCount, 
//     axios,
//     theme,
//     toggleTheme
//   } = useAppContext();
  
//   const navigate = useNavigate();

//   const logOut = async () => {
//     try {
//       const { data } = await axios.get("/api/user/logout");
//       if (data.success) {
//         toast.success(data.message);
//         setUser(null);
//         navigate("/");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.length > 0) {
//       navigate("/products");
//     }
//   }, [searchQuery, navigate]);

//   return (
//     <nav className={`flex items-center justify-between px-2 md:px-8 lg:px-12 py-4 border-b h-16 ${
//       theme === 'dark' 
//         ? 'bg-gray-900 border-gray-700 text-gray-100' 
//         : 'bg-white border-gray-200 text-gray-800'
//     } sticky top-0 z-50 shadow-sm transition-colors duration-300`}>

//       {/* Logo */}
//       <NavLink to="/" className="flex-shrink-0 h-12 w-auto">
//         <img 
//           src={theme === 'dark' ? LogoDark : Logo} 
//           alt="logo" 
//           className="h-12 p-1" 
//         />
//       </NavLink>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
//         <NavLink 
//           to="/" 
//           className={`font-medium text-sm lg:text-base hover:text-primary ${
//             theme === 'dark' ? 'hover:text-purple-300' : 'hover:text-purple-600'
//           } transition-colors`}
//         >
//           Home
//         </NavLink>
//         <NavLink 
//           to="Products" 
//           className={`font-medium text-sm lg:text-base hover:text-primary ${
//             theme === 'dark' ? 'hover:text-purple-300' : 'hover:text-purple-600'
//           } transition-colors`}
//         >
//           Products
//         </NavLink>
  
//         {/* Search Bar */}
//         <div className={`hidden xl:flex items-center w-64 border rounded-full px-4 py-2 ${
//           theme === 'dark' 
//             ? 'border-gray-600 bg-gray-800 focus-within:border-purple-400' 
//             : 'border-gray-300 bg-gray-50 focus-within:border-purple-500'
//         } transition-colors`}>
//           <input
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full bg-transparent outline-none placeholder-${
//               theme === 'dark' ? 'gray-400' : 'gray-500'
//             }`}
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//           />
//         </div>

//         {/* Theme Toggle */}
//         <button
//           onClick={toggleTheme}
//           className={`p-2 rounded-full ${
//             theme === 'dark' 
//               ? 'text-yellow-300 hover:bg-gray-700' 
//               : 'text-gray-700 hover:bg-gray-100'
//           } transition-colors`}
//           aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//         >
//           {theme === 'dark' ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//             </svg>
//           )}
//         </button>

//         {/* Cart Icon */}
//         <div 
//           onClick={() => navigate("/cart")} 
//           className="relative cursor-pointer group"
//         >
//           <img
//             src={theme === 'dark' ? assets.nav_cart_icon_light : assets.nav_cart_icon}
//             alt="cart"
//             className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
//           />
//           <span className={`absolute -top-2 -right-3 text-xs font-semibold text-white ${
//             theme === 'dark' ? 'bg-purple-500' : 'bg-primary'
//           } w-5 h-5 rounded-full flex items-center justify-center`}>
//             {getCartCount()}
//           </span>
//         </div>

//         {/* User Auth Section */}
//         {!user ? (
//           <button
//             onClick={() => setShowUserLogin(true)}
//             className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
//               theme === 'dark' 
//                 ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                 : 'bg-primary hover:bg-primary-dark text-white'
//             }`}
//           >
//             Login
//           </button>
//         ) : (
//           <div className="relative">
//             <div 
//               className="flex items-center gap-2 cursor-pointer" 
//               onClick={() => setOpen(!open)}
//             >
//               <img
//                 src={assets.profile_icon}
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full object-cover"
//               />
//               <span className="text-sm font-medium hidden lg:inline-block">
//                 My Account
//               </span>
//             </div>

//             {open && (
//               <ul
//                 className={`absolute top-full right-0 mt-2 shadow-lg rounded-md w-48 overflow-hidden z-50 ${
//                   theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
//                 }`}
//               >
//                 <li
//                   className={`px-4 py-3 text-sm cursor-pointer border-b ${
//                     theme === 'dark' 
//                       ? 'border-gray-700 hover:bg-gray-700' 
//                       : 'border-gray-100 hover:bg-gray-100'
//                   }`}
//                   onClick={() => {
//                     navigate("/my-orders");
//                     setOpen(false);
//                   }}
//                 >
//                   My Orders
//                 </li>
//                 <li
//                   className={`px-4 py-3 text-sm cursor-pointer ${
//                     theme === 'dark' 
//                       ? 'hover:bg-gray-700 text-red-400' 
//                       : 'hover:bg-gray-100 text-red-600'
//                   }`}
//                   onClick={() => {
//                     logOut();
//                     setOpen(false);
//                   }}
//                 >
//                   Logout
//                 </li>
//               </ul>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu Button */}
//       <div className="flex items-center md:hidden gap-4">
//         {/* Theme Toggle - Mobile */}
//         <button
//           onClick={toggleTheme}
//           className={`p-2 rounded-full ${
//             theme === 'dark' 
//               ? 'text-yellow-300 hover:bg-gray-700' 
//               : 'text-gray-700 hover:bg-gray-100'
//           }`}
//           aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//         >
//           {theme === 'dark' ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//             </svg>
//           )}
//         </button>

//         {/* Cart Icon - Mobile */}
//         <div 
//           onClick={() => navigate("/cart")} 
//           className="relative cursor-pointer group"
//         >
//           <img
//             src={theme === 'dark' ? assets.nav_cart_icon_light : assets.nav_cart_icon}
//             alt="cart"
//             className="w-6 h-6 opacity-80 group-hover:opacity-100"
//           />
//           <span className={`absolute -top-2 -right-3 text-xs font-semibold text-white ${
//             theme === 'dark' ? 'bg-purple-500' : 'bg-primary'
//           } w-5 h-5 rounded-full flex items-center justify-center`}>
//             {getCartCount()}
//           </span>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={() => setOpen(!open)}
//           aria-label="Menu"
//           className={`p-2 rounded-md ${
//             theme === 'dark' 
//               ? 'text-gray-300 hover:text-purple-300' 
//               : 'text-gray-700 hover:text-primary'
//           }`}
//         >
//           {open ? (
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className={`md:hidden fixed top-16 left-0 w-full py-3 px-4 flex flex-col space-y-3 z-40 ${
//           theme === 'dark' 
//             ? 'bg-gray-900 border-t border-gray-700' 
//             : 'bg-white border-t border-gray-200'
//         } shadow-lg transition-colors`}
//         >
//           {/* Mobile Search */}
//           <div className={`flex items-center w-full border rounded-full px-4 py-2 ${
//             theme === 'dark' 
//               ? 'border-gray-600 bg-gray-800 focus-within:border-purple-400' 
//               : 'border-gray-300 bg-gray-50 focus-within:border-purple-500'
//           }`}>
//             <input
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={`w-full bg-transparent outline-none placeholder-${
//                 theme === 'dark' ? 'gray-400' : 'gray-500'
//               }`}
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//             />
//           </div>

//           <NavLink 
//             to="/" 
//             className={`py-2 px-3 rounded-lg ${
//               theme === 'dark' 
//                 ? 'hover:bg-gray-700' 
//                 : 'hover:bg-gray-100'
//             }`}
//             onClick={() => setOpen(false)}
//           >
//             Home
//           </NavLink>
//           <NavLink 
//             to="Products" 
//             className={`py-2 px-3 rounded-lg ${
//               theme === 'dark' 
//                 ? 'hover:bg-gray-700' 
//                 : 'hover:bg-gray-100'
//             }`}
//             onClick={() => setOpen(false)}
//           >
//             Products
//           </NavLink>
//           {user && (
//             <NavLink 
//               to="/my-orders" 
//               className={`py-2 px-3 rounded-lg ${
//                 theme === 'dark' 
//                   ? 'hover:bg-gray-700' 
//                   : 'hover:bg-gray-100'
//               }`}
//               onClick={() => setOpen(false)}
//             >
//               My Orders
//             </NavLink>
//           )}

//           {/* Mobile Auth Buttons */}
//           <div className="flex space-x-3 mt-2">
//             {!user ? (
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   setShowUserLogin(true);
//                 }}
//                 className={`flex-1 px-4 py-2 rounded-full text-sm ${
//                   theme === 'dark' 
//                     ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                     : 'bg-primary hover:bg-primary-dark text-white'
//                 }`}
//               >
//                 Sign In
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/my-orders");
//                   }}
//                   className={`flex-1 px-4 py-2 rounded-full text-sm ${
//                     theme === 'dark' 
//                       ? 'bg-gray-700 hover:bg-gray-600' 
//                       : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   Account
//                 </button>
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     logOut();
//                   }}
//                   className={`flex-1 px-4 py-2 rounded-full text-sm ${
//                     theme === 'dark' 
//                       ? 'bg-red-900 hover:bg-red-800 text-red-200' 
//                       : 'bg-red-50 hover:bg-red-100 text-red-600'
//                   }`}
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;