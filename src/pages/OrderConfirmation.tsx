import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Phone } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg p-8 md:p-12 border border-border-soft shadow-custom">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle size={48} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-text-light mb-2 text-lg">Your Order ID is: <span className="font-bold text-text-dark">#{id}</span></p>
        <p className="text-text-light mb-8">
          We will confirm your order shortly. If you chose a bank transfer or mobile payment, 
          your order will be processed once the payment is verified.
        </p>
        
        <div className="bg-primary/5 rounded p-6 mb-8 inline-block text-left border border-border-soft">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Phone size={18} className="text-primary" /> Need help?
          </h3>
          <p className="text-text-light text-sm">
            Call or WhatsApp us at <a href="tel:03296205005" className="font-bold text-primary hover:underline">03296205005</a> for any queries regarding your order.
          </p>
        </div>

        <div>
          <Link to="/" className="inline-block bg-primary hover:bg-primary-light text-white font-bold px-8 py-3 rounded transition-colors shadow-custom">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
