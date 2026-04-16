import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    specialInstructions: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [screenshot, setScreenshot] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          total,
          paymentScreenshot: screenshot
        })
      });
      
      const data = await res.json();
      if (data.orderId) {
        clearCart();
        navigate(`/order-confirmation/${data.orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const needsScreenshot = formData.paymentMethod !== 'Cash on Delivery';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg border border-border-soft p-6 shadow-custom">
              <h2 className="font-bold text-xl mb-6 pb-4 border-b border-border-soft">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-blue-100 rounded focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="customerPhone"
                    required
                    placeholder="03XXXXXXXXX"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-blue-100 rounded focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Full Address (Daska Only) *</label>
                  <textarea 
                    name="customerAddress"
                    required
                    rows={3}
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-blue-100 rounded focus:ring-2 focus:ring-primary outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Special Instructions (Optional)</label>
                  <input 
                    type="text" 
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-blue-100 rounded focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-border-soft p-6 shadow-custom">
              <h2 className="font-bold text-xl mb-6 pb-4 border-b border-border-soft">Payment Method</h2>
              <div className="space-y-3">
                {['Cash on Delivery', 'Bank Transfer - HBL', 'Bank Transfer - Meezan', 'EasyPaisa', 'JazzCash'].map(method => (
                  <label key={method} className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${formData.paymentMethod === method ? 'border-primary bg-primary/5' : 'border-border-soft hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-3 font-medium">{method}</span>
                  </label>
                ))}
              </div>

              {needsScreenshot && (
                <div className="mt-6 p-4 bg-gray-50 rounded border border-border-soft">
                  <h3 className="font-bold mb-2">Payment Instructions</h3>
                  {formData.paymentMethod.includes('HBL') && (
                    <p className="text-sm text-text-light mb-4">Account Name: D Mart Daska<br/>Account #: 1234567890<br/>IBAN: PK00HABB00000000000000</p>
                  )}
                  {formData.paymentMethod.includes('Meezan') && (
                    <p className="text-sm text-text-light mb-4">Account Name: D Mart Daska<br/>Account #: 0987654321<br/>IBAN: PK00MEZN00000000000000</p>
                  )}
                  {(formData.paymentMethod.includes('EasyPaisa') || formData.paymentMethod.includes('JazzCash')) && (
                    <p className="text-sm text-text-light mb-4">Mobile Number: 03296205005<br/>Name: D Mart Daska</p>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Upload Payment Screenshot *</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      required={needsScreenshot}
                      onChange={handleFileChange}
                      className="w-full text-sm text-text-light file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-custom disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Place Order'}
              {!loading && <CheckCircle2 size={20} />}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg border border-border-soft p-6 shadow-custom sticky top-24">
            <h2 className="font-bold text-xl mb-6 pb-4 border-b border-border-soft">Order Summary</h2>
            
            <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-light flex-1 pr-4">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-text-dark">Rs. {item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 mb-6 border-t border-border-soft pt-4">
              <div className="flex justify-between text-text-light">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-text-light">
                <span>Delivery Fee</span>
                <span className="text-primary font-medium">FREE</span>
              </div>
            </div>
            
            <div className="border-t border-border-soft pt-4">
              <div className="flex justify-between items-center text-text-dark">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-2xl text-primary">Rs. {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
