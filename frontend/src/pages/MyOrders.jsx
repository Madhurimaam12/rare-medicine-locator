import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { downloadOrderInvoice } from '../utils/pdfGenerator';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPaymentMode, setEditPaymentMode] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    document.body.classList.add('myorders-page-active');
    fetchOrders();
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    
    return () => {
      document.body.classList.remove('myorders-page-active');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders([...response.data]);
      setFilteredOrders([...response.data]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Could not load your orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  };

  const updateOrderDetails = async (orderId) => {
    if (!editPhone.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!editAddress.trim()) {
      toast.error('Please enter billing address');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/update-details`, {
        phoneNumber: editPhone,
        billingAddress: editAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order details updated successfully!');
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update details');
    }
  };

  const updatePaymentMode = async (orderId, paymentMode) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/payment-mode`, { paymentMode }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Payment mode updated to ${getPaymentModeLabel(paymentMode)}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment mode');
    }
  };

  const cancelOrder = async (orderId, reason) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        cancelReason: reason || 'User requested cancellation'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const submitRating = async () => {
    if (ratingValue === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}/rating`, {
        rating: ratingValue,
        review: reviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Thank you for your feedback!');
      setShowRatingModal(false);
      setRatingValue(0);
      setReviewText('');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const setReminder = async () => {
    if (!reminderDate) {
      toast.error('Please select a reminder date');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}/reminder`, {
        reminderDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Reminder set for ${new Date(reminderDate).toLocaleDateString()}`);
      setShowReminderModal(false);
      setReminderDate('');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };

  // Timeline Component - Renders circles and progress bar
  const OrderTimeline = ({ status }) => {
    const normalizedStatus = String(status || '').toLowerCase().trim();
    
    if (normalizedStatus === 'cancelled') {
      return (
        <div className="alert alert-danger text-center py-2 mt-2">
          <strong>Order Cancelled</strong>
        </div>
      );
    }
    
    // Determine which steps are complete
    const isRequested = true; // Always true
    const isConfirmed = normalizedStatus === 'confirmed' || normalizedStatus === 'shipped' || normalizedStatus === 'delivered';
    const isShipped = normalizedStatus === 'shipped' || normalizedStatus === 'delivered';
    const isDelivered = normalizedStatus === 'delivered';
    
    // Calculate progress percentage
    let progressPercent = 25; // Default for pending
    if (isDelivered) progressPercent = 100;
    else if (isShipped) progressPercent = 75;
    else if (isConfirmed) progressPercent = 50;
    else progressPercent = 25;
    
    return (
      <div className="mt-3 mb-3">
        <div className="d-flex justify-content-between">
          <div className="text-center" style={{ flex: 1 }}>
            <div className={`rounded-circle mx-auto ${isRequested ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></div>
            <small className={isRequested ? 'text-success' : 'text-muted'}>Requested</small>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <div className={`rounded-circle mx-auto ${isConfirmed ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></div>
            <small className={isConfirmed ? 'text-success' : 'text-muted'}>Confirmed</small>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <div className={`rounded-circle mx-auto ${isShipped ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></div>
            <small className={isShipped ? 'text-success' : 'text-muted'}>Shipped</small>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <div className={`rounded-circle mx-auto ${isDelivered ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></div>
            <small className={isDelivered ? 'text-success' : 'text-muted'}>Delivered</small>
          </div>
        </div>
        <div className="progress mt-2" style={{ height: '5px' }}>
          <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    );
  };

  const getPaymentBadge = (status) => {
    const normalizedStatus = String(status || '').toLowerCase();
    switch (normalizedStatus) {
      case 'paid': return <span className="badge bg-success">Paid ✓</span>;
      case 'failed': return <span className="badge bg-danger">Failed</span>;
      default: return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const getOrderBadge = (status) => {
    const colors = {
      pending: 'secondary',
      confirmed: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    const normalizedStatus = String(status || '').toLowerCase();
    const displayStatus = normalizedStatus.toUpperCase();
    return <span className={`badge bg-${colors[normalizedStatus] || 'secondary'}`}>{displayStatus}</span>;
  };

  const getPaymentModeLabel = (mode) => {
    const modes = {
      cash: 'Cash on Delivery',
      card: 'Card Payment',
      upi: 'UPI Payment',
      insurance: 'Insurance'
    };
    return modes[mode] || mode;
  };

  const startEditing = (order) => {
    setEditingOrder(order._id);
    setEditPhone(order.phoneNumber || '');
    setEditAddress(order.billingAddress || '');
    setEditPaymentMode(order.paymentMode || 'cash');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Rare Medicine Locator</a>
          <button className="btn btn-light" onClick={() => navigate('/')}>Back to Search</button>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-5 my-5" style={{ width: '100%', margin: 0 }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 style={{ color: 'var(--text-h)' }}>My Orders</h2>
          <div className="d-flex gap-2 align-items-center">
            <span className="text-muted">Filter:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-sm btn-outline-primary ms-2" onClick={fetchOrders}>
              Refresh
            </button>
            <span className="text-muted ms-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span className="text-muted ms-2">Welcome, {userName}</span>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="alert alert-info text-center">
            <h5>No orders found</h5>
            <p>You haven't placed any orders yet. Search for medicines and submit a request to get started.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>Browse Medicines</button>
          </div>
        ) : (
          <div className="row">
            {filteredOrders.map((order) => (
              <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title text-primary">{order.medicineName}</h5>
                      {getOrderBadge(order.status)}
                    </div>
                    <p className="card-text text-muted small">Order ID: {order._id.slice(-8)}</p>

                    {/* Timeline Component */}
                    <OrderTimeline status={order.status} />

                    <hr style={{ borderColor: 'var(--border)' }} />

                    {editingOrder === order._id ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label small fw-bold">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold">Billing Address</label>
                          <textarea
                            className="form-control form-control-sm"
                            rows="2"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold">Payment Mode</label>
                          <select
                            className="form-select form-select-sm"
                            value={editPaymentMode}
                            onChange={(e) => setEditPaymentMode(e.target.value)}
                          >
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Card Payment</option>
                            <option value="upi">UPI Payment</option>
                            <option value="insurance">Insurance</option>
                          </select>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-sm btn-success" onClick={async () => {
                            await updateOrderDetails(order._id);
                            await updatePaymentMode(order._id, editPaymentMode);
                          }}>Save All</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditingOrder(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toLocaleString()}</p>
                        <p><strong>Phone:</strong> {order.phoneNumber || 'Not provided'}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <button className="btn btn-sm btn-link text-primary p-0 ms-2" onClick={() => startEditing(order)}>Edit</button>
                          )}
                        </p>
                        <p><strong>Billing Address:</strong> {order.billingAddress}</p>
                        <p><strong>Payment:</strong> {getPaymentBadge(order.paymentStatus)}</p>
                        <p><strong>Payment Mode:</strong>
                          <select
                            className="form-select form-select-sm d-inline-block w-auto ms-2"
                            style={{ width: 'auto', display: 'inline-block' }}
                            value={order.paymentMode}
                            onChange={(e) => updatePaymentMode(order._id, e.target.value)}
                            disabled={order.status === 'cancelled' || order.status === 'delivered'}
                          >
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Card Payment</option>
                            <option value="upi">UPI Payment</option>
                            <option value="insurance">Insurance</option>
                          </select>
                        </p>
                        <p><strong>Delivery By:</strong> {new Date(order.deliveryByDate).toLocaleDateString()}</p>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

                        <div className="d-flex gap-2 mt-3 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-info flex-grow-1"
                            onClick={() => downloadOrderInvoice(order, 'Registered Pharmacy')}
                          >
                            Download Invoice
                          </button>
                          
                          {(order.status === 'delivered' || order.status === 'Delivered') && !order.rating && (
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRatingModal(true);
                              }}
                            >
                              Rate Order
                            </button>
                          )}
                          
                          {order.rating && (
                            <span className="badge bg-success d-flex align-items-center">
                              Rated: {order.rating}/5
                            </span>
                          )}
                          
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowReminderModal(true);
                                }}
                              >
                                Set Reminder
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  const reason = prompt('Reason for cancellation (optional):');
                                  cancelOrder(order._id, reason);
                                }}
                              >
                                Cancel Order
                              </button>
                            </>
                          )}
                          {order.reminderDate && (
                            <small className="text-muted w-100 text-center mt-1">
                              Reminder: {new Date(order.reminderDate).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
              <div className="modal-header">
                <h5 className="modal-title">Rate {selectedOrder.medicineName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowRatingModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        className={`btn ${ratingValue >= num ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setRatingValue(num)}
                        style={{ minWidth: '60px' }}
                      >
                        {num} / 5
                      </button>
                    ))}
                  </div>
                  <small className="text-muted mt-2 d-block">
                    {ratingValue === 1 && 'Poor - Not satisfied'}
                    {ratingValue === 2 && 'Fair - Could be better'}
                    {ratingValue === 3 && 'Good - Satisfied'}
                    {ratingValue === 4 && 'Very Good - Happy with service'}
                    {ratingValue === 5 && 'Excellent - Very satisfied'}
                  </small>
                </div>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write your review (optional)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitRating}>Submit Rating</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
              <div className="modal-header">
                <h5 className="modal-title">Set Reminder for {selectedOrder.medicineName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowReminderModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Select reminder date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <small className="text-muted">We will remind you about your medicine on this date.</small>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowReminderModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={setReminder}>Set Reminder</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        body.myorders-page-active #root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          border-inline: none;
          padding: 0;
        }
        body.myorders-page-active {
          overflow-x: hidden;
        }
        .progress {
          background-color: #e5e7eb;
        }
        .dark .progress {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;