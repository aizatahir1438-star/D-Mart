import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <ShoppingBag size={48} />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="inline-block bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-full transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-border-soft overflow-hidden shadow-custom">
            <ul className="divide-y divide-border-soft">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-50"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`} className="font-medium text-lg hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">Rs. {item.price} / {item.unit}</div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="flex items-center border border-gray-300 rounded-full bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="font-bold text-lg w-24 text-right">
                      Rs. {item.price * item.quantity}
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg border border-border-soft p-6 shadow-custom sticky top-24">
            <h2 className="font-bold text-xl mb-6 pb-4 border-b border-border-soft">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-light">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-text-light">
                <span>Delivery Fee</span>
                <span className="text-primary font-medium">FREE</span>
              </div>
            </div>
            
            <div className="border-t border-border-soft pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-2xl text-primary">Rs. {total}</span>
              </div>
              <p className="text-xs text-text-light mt-2 text-right">Free delivery within Daska</p>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-custom"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
