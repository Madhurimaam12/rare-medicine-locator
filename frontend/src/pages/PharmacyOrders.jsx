import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const PharmacyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDeliveryDate, setEditDeliveryDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const pharmacyName = localStorage.getItem('userName');

  useEffect(() => {
    document.body.classList.add('pharmacy-orders-page-active');
    fetchOrders();
    return () => {
      document.body.classList.remove('pharmacy-orders-page-active');
    };
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Could not load orders');
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

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/payment`, { paymentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Payment status updated to ${paymentStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const updatePaymentMode = async (orderId, paymentMode) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/payment-mode`, { paymentMode }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Payment mode updated to ${paymentMode}`);
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const assignDeliveryPartner = async (orderId, deliveryPartner) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/delivery-partner`, { deliveryPartner }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Delivery partner assigned: ${deliveryPartner}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign delivery partner');
    }
  };

  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/delivery-status`, { deliveryStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Delivery status updated to ${deliveryStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update delivery status');
    }
  };

  const saveOrderEdits = async (orderId) => {
    if (!editPhone && !editAddress && !editDeliveryDate) {
      toast.error('No changes to save');
      return;
    }

    try {
      if (editPhone || editAddress) {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/update-details`, {
          phoneNumber: editPhone,
          billingAddress: editAddress
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (editDeliveryDate) {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/delivery-date`, {
          deliveryByDate: editDeliveryDate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      toast.success('Order updated successfully');
      setEditingOrder(null);
      setEditPhone('');
      setEditAddress('');
      setEditDeliveryDate('');
      fetchOrders();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const startEditing = (order) => {
    setEditingOrder(order._id);
    setEditPhone(order.phoneNumber || '');
    setEditAddress(order.billingAddress || '');
    setEditDeliveryDate(order.deliveryByDate?.split('T')[0] || '');
  };

  const exportOrdersToExcel = () => {
    const exportData = filteredOrders.map(order => ({
      'Order ID': order._id.slice(-8),
      'Patient Name': order.userName,
      'Phone': order.phoneNumber,
      'Medicine': order.medicineName,
      'Amount': order.totalAmount,
      'Payment Status': order.paymentStatus,
      'Payment Mode': order.paymentMode,
      'Order Status': order.status,
      'Cancellation Reason': order.cancelReason || '-',
      'Rating': order.rating ? `${order.rating}★` : '-',
      'Delivery Partner': order.deliveryPartner || '-',
      'Order Date': new Date(order.orderDate).toLocaleDateString(),
      'Delivery By': new Date(order.deliveryByDate).toLocaleDateString(),
      'Address': order.billingAddress
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Orders exported successfully!');
  };

  const getPaymentBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="badge bg-success">Paid</span>;
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
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
  };

  const getDeliveryStatusBadge = (status) => {
    const colors = {
      pending: 'secondary',
      picked: 'info',
      in_transit: 'primary',
      delivered: 'success'
    };
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status?.replace('_', ' ') || 'pending'}</span>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      {/* Navbar - Full Width */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Pharmacy Orders</a>
          <div className="ms-auto">
            <button className="btn btn-secondary me-2" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="btn btn-info me-2 text-white" onClick={exportOrdersToExcel}>Export Excel</button>
            <button className="btn btn-light" onClick={() => navigate('/')}>Back to Search</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-5 my-5" style={{ width: '100%', margin: 0 }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 style={{ color: 'var(--text-h)' }}>Order Management</h2>
          <div className="d-flex gap-2 align-items-center">
            <span className="text-muted">Filter by status:</span>
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
            <span className="text-muted ms-2">Logged in as: {pharmacyName}</span>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="alert alert-info text-center">
            <h5>No orders yet</h5>
            <p>When patients submit requests and you approve them, orders will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Medicine</th>
                  <th>Amount</th>
                  <th>Address</th>
                  <th>Payment</th>
                  <th>Payment Mode</th>
                  <th>Delivery By</th>
                  <th>Status / Reason</th>
                  <th>Rating</th>
                  <th>Delivery Partner</th>
                  <th>Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td><code>{order._id.slice(-8)}</code></td>
                    <td>{order.userName}</td>
                    <td>
                      {editingOrder === order._id ? (
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Phone number"
                        />
                      ) : (
                        order.phoneNumber || '—'
                      )}
                    </td>
                    <td>{order.medicineName}</td>
                    <td>₹{order.totalAmount?.toLocaleString()}</td>
                    <td>
                      {editingOrder === order._id ? (
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          placeholder="Billing address"
                        />
                      ) : (
                        order.billingAddress?.substring(0, 40) + (order.billingAddress?.length > 40 ? '...' : '')
                      )}
                    </td>
                    <td>{getPaymentBadge(order.paymentStatus)}</td>
                    <td>
                      <select 
                        className="form-select form-select-sm" 
                        style={{ width: '100px' }} 
                        onChange={(e) => updatePaymentMode(order._id, e.target.value)} 
                        value={order.paymentMode}
                        disabled={order.status === 'cancelled'}
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="insurance">Insurance</option>
                      </select>
                    </td>
                    <td>
                      {editingOrder === order._id ? (
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={editDeliveryDate}
                          onChange={(e) => setEditDeliveryDate(e.target.value)}
                        />
                      ) : (
                        new Date(order.deliveryByDate).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {getOrderBadge(order.status)}
                      {order.status === 'cancelled' && order.cancelReason && (
                        <div className="mt-1">
                          <small className="text-danger">
                            <strong>Reason:</strong> {order.cancelReason}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
  {order.rating ? (
    <div>
      <span className="badge bg-primary">
        Rating: {order.rating}/5
      </span>
      {order.review && (
        <small className="d-block text-muted mt-1" title={order.review}>
          "{order.review.length > 30 ? order.review.substring(0, 30) + '...' : order.review}"
        </small>
      )}
    </div>
  ) : (
    <span className="text-muted">Not rated</span>
  )}
</td>
                    <td>
                      <select 
                        className="form-select form-select-sm" 
                        style={{ width: '120px' }}
                        value={order.deliveryPartner || ''}
                        onChange={(e) => assignDeliveryPartner(order._id, e.target.value)}
                        disabled={order.status === 'cancelled'}
                      >
                        <option value="">Select Partner</option>
                        <option value="Bluedart">Bluedart</option>
                        <option value="Delhivery">Delhivery</option>
                        <option value="DTDC">DTDC</option>
                        <option value="Ekart">Ekart</option>
                        <option value="Xpressbees">Xpressbees</option>
                        <option value="Amazon Shipping">Amazon Shipping</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select form-select-sm" 
                        style={{ width: '120px' }}
                        value={order.deliveryStatus || 'pending'}
                        onChange={(e) => updateDeliveryStatus(order._id, e.target.value)}
                        disabled={order.status === 'cancelled'}
                      >
                        <option value="pending">Pending</option>
                        <option value="picked">Picked Up</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      {editingOrder === order._id ? (
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-success" onClick={() => saveOrderEdits(order._id)}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditingOrder(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => startEditing(order)}>Edit</button>
                          <select 
                            className="form-select form-select-sm" 
                            style={{ width: '100px' }} 
                            onChange={(e) => updatePaymentStatus(order._id, e.target.value)} 
                            value={order.paymentStatus}
                            disabled={order.status === 'cancelled'}
                          >
                            <option value="pending">Payment</option>
                            <option value="paid">Mark Paid</option>
                            <option value="failed">Mark Failed</option>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        body.pharmacy-orders-page-active #root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          border-inline: none;
          padding: 0;
        }
        body.pharmacy-orders-page-active {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default PharmacyOrders;