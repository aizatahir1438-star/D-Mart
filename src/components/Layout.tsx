import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Phone, Home, Grid, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="bg-primary-dark text-white text-xs py-2 px-4 flex justify-between items-center hidden md:flex">
        <div>Free Delivery in Daska for orders over Rs. 1000</div>
        <div className="flex items-center gap-4">
          <a href="tel:03296205005" className="flex items-center gap-1 hover:text-accent transition-colors">
            <Phone size={14} /> 03296205005
          </a>
          <Link to="/admin/login" className="hover:text-accent transition-colors">Admin</Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-primary text-white sticky top-0 z-50 border-b-[3px] border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-[3rem]">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 logo">
              <span className="font-display font-bold text-[1.8rem] tracking-[1px] uppercase">D Mart <span className="text-accent">Daska</span></span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-[450px] mx-8">
              <div className="relative w-full bg-white rounded flex items-center h-[40px] px-[10px]">
                <input 
                  type="text" 
                  placeholder="Search for groceries, milk, fruits..." 
                  className="w-full border-none flex-grow outline-none py-2 text-text-dark bg-transparent"
                />
                <button className="text-[#999]">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <Link to="/cart" className="flex items-center gap-2 font-semibold hover:text-accent transition-colors">
                Cart
                <span className="bg-accent text-white text-[0.8rem] rounded-full px-2 py-[2px]">{cartCount}</span>
              </Link>
              <div className="text-[0.9rem] cursor-pointer hover:text-accent">Account</div>
            </div>
          </div>
          
          {/* Search - Mobile */}
          <div className="pb-4 md:hidden">
            <div className="relative w-full bg-white rounded flex items-center h-[40px] px-[10px]">
              <input 
                type="text" 
                placeholder="Search for groceries, milk, fruits..." 
                className="w-full border-none flex-grow outline-none py-2 text-text-dark bg-transparent"
              />
              <button className="text-[#999]">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#eee] px-6 md:px-12 py-[12px] text-[0.8rem] flex flex-col md:flex-row justify-between text-text-light border-t border-border-soft mt-auto hidden md:flex">
        <div>College Road, Daska, Sialkot District</div>
        <div>0329 6205005 • Support Available 9AM - 11PM</div>
        <div>© {new Date().getFullYear()} D Mart Daska. All Rights Reserved.</div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <Home size={24} />
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link to="/products" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <Grid size={24} />
          <span className="text-[10px] mt-1">Categories</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-primary relative">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-accent text-primary-dark text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center transform translate-x-2 -translate-y-1">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-1">Cart</span>
        </Link>
        <a href="https://wa.me/923296205005" target="_blank" rel="noreferrer" className="flex flex-col items-center text-green-600">
          <Phone size={24} />
          <span className="text-[10px] mt-1">Contact</span>
        </a>
      </div>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923296205005" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-[30px] right-[30px] bg-[#25D366] text-white w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] font-bold text-sm z-50 hover:scale-105 transition-transform"
      >
        WA
      </a>
    </div>
  );
}
