import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filteredProducts = categoryParam 
    ? products.filter((p: any) => p.category === categoryParam)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-gray-100">
              <Filter size={20} />
              Filters
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-sm w-full text-left px-2 py-1.5 rounded ${!categoryParam ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setSearchParams({ category: cat.name })}
                      className={`text-sm w-full text-left px-2 py-1.5 rounded ${categoryParam === cat.name ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold mb-6">
            {categoryParam ? categoryParam : 'All Products'}
            <span className="text-sm font-normal text-gray-500 ml-3">({filteredProducts.length} items)</span>
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg p-4 border border-border-soft shadow-custom relative flex flex-col group">
                  <Link to={`/product/${product.id}`} className="flex-grow flex flex-col">
                    <div className="bg-[#f0f2f5] w-full h-[120px] rounded mb-3 flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-text-light mb-1">{product.category}</div>
                    <div className="font-bold text-text-dark leading-tight">{product.name}</div>
                    <div className="text-text-light text-[0.8rem] mb-auto">{product.unit}</div>
                    <div className="text-primary font-bold text-[1.2rem] mt-2">PKR {product.price}</div>
                  </Link>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`mt-3 border-none py-2 w-full rounded cursor-pointer font-semibold flex items-center justify-center gap-[5px] transition-colors ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-light'}`}
                    aria-label="Add to cart"
                  >
                    {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 mb-4">No products found in this category.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="text-primary font-medium hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
