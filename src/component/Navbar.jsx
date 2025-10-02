import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { API_URL } from '../config/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const { cartItems } = useCart();
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Hide navbar on auth pages
  const hideNavbarRoutes = ['/login', "/", '/register', '/forgotpassword'];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
     
      <div className="h-16 md:h-16"></div>
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#FF4C29] py-3 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to={user ? "/dashboard" : "/"} className="text-white font-bold text-2xl">
            QuickPlate
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-white">
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<FaHome />} active={isActive('/dashboard')}>
                  Home
                </NavLink>
                <NavLink to="/cart" icon={<FaShoppingCart />} active={isActive('/cart')} badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)}>
                  Cart
                </NavLink>
                <NavLink to="/orders" active={isActive('/orders')}>
                  Orders
                </NavLink>
                <NavLink to="/profile" icon={<FaUser />} active={isActive('/profile')}>
                  Profile
                </NavLink>

                {user.role === 'admin' && (
  <div className="relative group">
    <button className="px-3 py-2 rounded-lg bg-opacity-20 bg-white text-white flex items-center gap-1">
      Admin
     
      <svg 
        className="w-4 h-4 transition-transform group-hover:rotate-180" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    

    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      <div className="w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
        <Link 
          to="/admin/dashboard" 
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/foods" 
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Foods
        </Link>
        <Link 
          to="/admin/orders" 
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Orders
        </Link>
      </div>
    </div>
  </div>
)}

                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition text-white">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-white text-[#FF4C29] rounded-lg hover:bg-opacity-90 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div 
            ref={menuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-[#FF4C29] shadow-lg px-6 py-4 transition-all duration-300"
          >
            <div className="flex flex-col gap-3 text-white">
              {user ? (
                <>
                  <MobileNavLink to="/dashboard" icon={<FaHome />} onClick={() => setMenuOpen(false)}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/cart" icon={<FaShoppingCart />} badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)} onClick={() => setMenuOpen(false)}>
                    Cart
                  </MobileNavLink>
                  <MobileNavLink to="/orders" onClick={() => setMenuOpen(false)}>
                    Orders
                  </MobileNavLink>
                  <MobileNavLink to="/profile" icon={<FaUser />} onClick={() => setMenuOpen(false)}>
                    Profile
                  </MobileNavLink>

                  {user.role === 'admin' && (
                    <>
                      <div className="font-medium px-4 py-2 mt-2 border-t border-white border-opacity-20">
                        Admin
                      </div>
                      <MobileNavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink to="/admin/foods" onClick={() => setMenuOpen(false)}>
                        Foods
                      </MobileNavLink>
                      <MobileNavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>
                        Orders
                      </MobileNavLink>
                    </>
                  )}

                  <button 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="mt-4 px-4 py-2 bg-white text-[#FF4C29] rounded-lg text-center font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/register" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

// Reusable component for desktop nav links
const NavLink = ({ to, children, icon, active, badge }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${active ? 'bg-white bg-opacity-30' : 'hover:bg-white hover:bg-opacity-10'} text-white`}
  >
    {icon}
    <span>{children}</span>
    {badge > 0 && (
      <span className="ml-1 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

// Reusable component for mobile nav links
const MobileNavLink = ({ to, children, icon, badge, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{children}</span>
    </div>
    {badge > 0 && (
      <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;

