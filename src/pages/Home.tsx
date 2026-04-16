import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 8))); // Featured products
    
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="px-6 md:px-12 py-6 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[280px]">
        <div className="md:col-span-2 bg-primary rounded-xl text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <h1 className="font-display text-[2.8rem] mb-3">Fresh Groceries</h1>
          <p className="text-[1.1rem] opacity-90 mb-6">Direct from local farms to your kitchen doorstep.</p>
          <div className="inline-block bg-accent text-white px-4 py-2 rounded font-bold uppercase text-[0.85rem] w-fit">
            Free Delivery in Daska
          </div>
        </div>
        <div className="bg-white border border-border-soft rounded-xl p-5 flex flex-col gap-[15px]">
          <h3 className="font-display border-b-[2px] border-accent pb-[10px] inline-block w-fit text-xl">Hot Offers</h3>
          <div className="p-[10px] border-l-[3px] border-primary bg-[#fdfdfd]">
            <p className="font-bold text-[0.9rem]">Weekend Special</p>
            <p className="text-[0.8rem] text-text-light">15% OFF on Dairy products</p>
          </div>
          <div className="p-[10px] border-l-[3px] border-accent bg-[#fdfdfd]">
            <p className="font-bold text-[0.9rem]">Fresh Arrival</p>
            <p className="text-[0.8rem] text-text-light">Swat Red Apples - Just In</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex gap-4 justify-between overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat: any) => (
          <Link key={cat.id} to={`/products?category=${cat.name}`} className="text-center flex-1 min-w-[80px]">
            <div className="bg-white border border-border-soft w-[60px] h-[60px] rounded-full mx-auto mb-2 flex items-center justify-center text-[1.5rem] shadow-sm">
              <img src={`https://picsum.photos/seed/${cat.name}/60/60`} alt={cat.name} className="w-[40px] h-[40px] rounded-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-[0.85rem] font-semibold text-text-light">{cat.name}</div>
          </Link>
        ))}
      </section>

      {/* Featured Products */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="font-display text-[1.4rem]">Featured Products</h2>
        <Link to="/products" className="text-accent text-[0.85rem] font-bold no-underline">View All &rarr;</Link>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg p-4 border border-border-soft shadow-custom relative flex flex-col">
            <Link to={`/product/${product.id}`}>
              <div className="bg-[#f0f2f5] w-full h-[120px] rounded mb-3 flex items-center justify-center overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
              </div>
              <div className="font-bold text-text-dark">{product.name}</div>
              <div className="text-text-light text-[0.8rem]">{product.unit}</div>
              <div className="text-primary font-bold text-[1.2rem] mt-2">PKR {product.price}</div>
            </Link>
            <button 
              onClick={() => addToCart(product)}
              className="mt-3 bg-primary text-white border-none py-2 w-full rounded cursor-pointer font-semibold flex items-center justify-center gap-[5px] hover:bg-primary-light transition-colors"
            >
              + Add to Cart
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
