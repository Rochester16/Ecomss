import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/MyPurchases.css';
import getFallbackImage from '../../utils/imageFallback';

export default function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filter);
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    let className = 'status-badge ';
    
    if (statusLower === 'pending') className += 'status-pending';
    else if (statusLower === 'completed' || statusLower === 'delivered') className += 'status-completed';
    else if (statusLower === 'cancelled') className += 'status-cancelled';
    else if (statusLower === 'processing' || statusLower === 'shipped') className += 'status-processing';
    
    return <span className={className}>{status}</span>;
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="purchases-page">
      <div className="purchases-container">
        <h1 className="page-title">
          <i className="fas fa-shopping-bag"></i>
          My Purchases
        </h1>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No {filter !== 'all' ? filter : ''} orders found</h3>
            <p>You haven't made any purchases yet.</p>
            <Link to="/shop" className="btn-shop">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.product?.image || getFallbackImage(item.product?.name)} 
                        alt={item.product?.name || 'Product'} 
                      />
                      <div className="item-details">
                        <h4>{item.product?.name || 'Product'}</h4>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                        <p className="item-price">₱{(item.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">
                      ₱{(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="order-actions">
                    <Link to={`/orders/${order._id}`} className="btn-view">
                      View Details
                    </Link>
                    {order.status.toLowerCase() === 'pending' && (
                      <button className="btn-cancel">
                        Cancel Order
                      </button>
                    )}
                    {order.status.toLowerCase() === 'completed' && (
                      <Link to={`/orders/${order._id}/review`} className="btn-review">
                        Write Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}