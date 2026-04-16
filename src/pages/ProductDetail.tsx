import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="text-primary hover:underline">Return to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to products
      </Link>

      <div className="bg-white rounded-lg border border-border-soft overflow-hidden shadow-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-[#f0f2f5] p-8 flex items-center justify-center relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-md h-[400px] object-cover mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-red-500 text-white text-xl font-bold px-6 py-2 rounded">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-sm text-text-light font-bold tracking-wider uppercase mb-2">
              {product.category}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-dark mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-bold text-primary">Rs. {product.price}</span>
              <span className="text-text-light mb-1">/ {product.unit}</span>
            </div>

            <p className="text-text-light mb-8 leading-relaxed">
              Fresh and premium quality {product.name.toLowerCase()} sourced locally. 
              Perfect for your daily needs. D Mart Daska ensures the best quality products 
              delivered right to your doorstep.
            </p>

            {product.stock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text-dark">Quantity:</span>
                  <div className="flex items-center border border-border-soft rounded bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-text-light hover:text-primary transition-colors cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-text-light hover:text-primary transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-text-light">{product.stock} available</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-soft">
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-primary hover:bg-primary-light text-white py-3 px-8 rounded font-bold flex items-center justify-center gap-2 transition-colors shadow-custom cursor-pointer"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded border border-red-100 font-medium text-center">
                Currently Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
