import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Pending Payment Verification': return 'bg-orange-100 text-orange-800';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading orders...</div>;

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter((o: any) => o.status === statusFilter);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Pending Payment Verification">Pending Payment</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">#{order.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">Rs. {order.total}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary hover:text-primary-light p-2"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Info</h3>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                  <p className="text-gray-600 mt-2">{selectedOrder.customerAddress}</p>
                  {selectedOrder.specialInstructions && (
                    <div className="mt-2 text-sm bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100">
                      <strong>Note:</strong> {selectedOrder.specialInstructions}
                    </div>
                  )}
                  <a 
                    href={`https://wa.me/92${selectedOrder.customerPhone.replace(/^0/, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    <MessageCircle size={16} /> Contact on WhatsApp
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Info</h3>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  <p className="text-gray-600">Total: Rs. {selectedOrder.total}</p>
                  
                  {selectedOrder.paymentScreenshot && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Payment Screenshot:</p>
                      <a href={selectedOrder.paymentScreenshot} target="_blank" rel="noreferrer">
                        <img src={selectedOrder.paymentScreenshot} alt="Payment" className="h-24 object-contain border border-gray-200 rounded cursor-pointer hover:opacity-80" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
              <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <li key={idx} className="p-3 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x Rs. {item.price}</p>
                      </div>
                    </div>
                    <div className="font-medium text-sm">
                      Rs. {item.quantity * item.price}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['New', 'Pending Payment Verification', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedOrder.id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.status === status ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
