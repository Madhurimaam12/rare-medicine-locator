import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationBell from '../components/NotificationBell';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const navigate = useNavigate();

  const pharmacyId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const pharmacyName = localStorage.getItem('userName');

  useEffect(() => {
    document.body.classList.add('dashboard-page-active');
    fetchMedicines();
    fetchRequests();
    fetchOrders();
    return () => document.body.classList.remove('dashboard-page-active');
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`https://rare-medicine-locator-main.onrender.com/api/medicines/my-medicines/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://rare-medicine-locator-main.onrender.com/api/requests/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://rare-medicine-locator-main.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) { console.error(error); }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockMedicines = medicines.filter(m => m.stock <= 5);
  const pendingApprovals = allRequests.filter(r => r.status === 'pending').length;

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const medicine = {
      name: formData.get('name'),
      genericName: formData.get('genericName'),
      manufacturer: formData.get('manufacturer'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      location: formData.get('location'),
      pharmacyId: pharmacyId
    };
    try {
      await axios.post('https://rare-medicine-locator-main.onrender.com/api/medicines', medicine, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Medicine added successfully!');
      setShowForm(false);
      fetchMedicines();
    } catch (error) { toast.error('Failed to add medicine'); }
  };

  const updateStock = async (id, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock !== null && !isNaN(parseInt(newStock))) {
      try {
        await axios.put(`https://rare-medicine-locator-main.onrender.com/api/medicines/${id}/stock`, { stock: parseInt(newStock) }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Stock updated');
        fetchMedicines();
      } catch (error) { toast.error('Failed to update stock'); }
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`https://rare-medicine-locator-main.onrender.com/api/requests/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error) { toast.error('Failed to update status'); }
  };

  const viewCustomerDetails = (customer) => {
    const customerOrders = orders.filter(o => o.userId === customer.userId);
    setSelectedCustomer({ ...customer, orders: customerOrders, totalOrders: customerOrders.length, totalSpent: customerOrders.reduce((sum, o) => sum + o.totalAmount, 0) });
    setShowCustomerModal(true);
  };

  const exportOrdersToExcel = () => {
    const exportData = orders.map(order => ({
      'Order ID': order._id.slice(-8),
      'Patient Name': order.userName,
      'Medicine': order.medicineName,
      'Amount': order.totalAmount,
      'Payment Status': order.paymentStatus,
      'Order Status': order.status,
      'Order Date': new Date(order.orderDate).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Orders exported!');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Pharmacy Dashboard</a>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <NotificationBell />
            <button className="btn btn-secondary" onClick={() => navigate('/pharmacy-orders')}>View Orders</button>
            <button className="btn btn-light ms-2" onClick={() => navigate('/')}>Back to Search</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-5 my-5">
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white shadow">
              <div className="card-body">
                <h6>Total Medicines</h6>
                <h2>{medicines.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white shadow">
              <div className="card-body">
                <h6>Total Orders</h6>
                <h2>{totalOrders}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white shadow">
              <div className="card-body">
                <h6>Total Revenue</h6>
                <h2>₹{totalRevenue.toLocaleString()}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-dark shadow">
              <div className="card-body">
                <h6>Pending Approvals</h6>
                <h2>{pendingApprovals}</h2>
              </div>
            </div>
          </div>
        </div>

        {lowStockMedicines.length > 0 && (
          <div className="alert alert-warning mb-4">
            <h5 className="mb-2">Low Stock Alert</h5>
            <div className="row">
              {lowStockMedicines.map(med => (
                <div className="col-md-3 col-sm-6 mb-2" key={med._id}>
                  <span className="badge bg-warning text-dark me-2">Low Stock</span>
                  <strong>{med.name}</strong> - Only {med.stock} left
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-12">
            <button className="btn btn-success me-2" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add New Medicine'}
            </button>
            <button className="btn btn-secondary" onClick={exportOrdersToExcel}>Export Orders</button>
          </div>
        </div>

        {showForm && (
          <div className="card mb-4 shadow">
            <div className="card-header bg-success text-white">
              <h4>Add New Medicine</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddMedicine}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" name="name" className="form-control" placeholder="Medicine Name" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name="genericName" className="form-control" placeholder="Generic Name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name="manufacturer" className="form-control" placeholder="Manufacturer" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="number" name="price" className="form-control" placeholder="Price (₹)" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="number" name="stock" className="form-control" placeholder="Stock Quantity" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name="location" className="form-control" placeholder="Location" required />
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-success">Save Medicine</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4>My Medicines ({medicines.length})</h4>
              </div>
              <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {medicines.length === 0 ? (
                  <p>No medicines added yet</p>
                ) : (
                  <div className="list-group">
                    {medicines.map((med) => (
                      <div key={med._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5>{med.name}</h5>
                            <p>{med.manufacturer} - ₹{med.price?.toLocaleString()}</p>
                            <p>Location: {med.location}</p>
                          </div>
                          <div className="text-end">
                            <span className={med.stock > 0 ? 'text-success' : 'text-danger'}>
                              Stock: {med.stock}
                            </span>
                            {med.stock <= 5 && med.stock > 0 && (
                              <span className="badge bg-warning text-dark ms-2 d-block mt-1">Low Stock!</span>
                            )}
                          </div>
                        </div>
                        <button className="btn btn-sm btn-primary mt-2" onClick={() => updateStock(med._id, med.stock)}>
                          Update Stock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h4>Patient Requests ({allRequests.length})</h4>
              </div>
              <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {allRequests.length === 0 ? (
                  <p>No requests yet</p>
                ) : (
                  <div className="list-group">
                    {allRequests.map((req) => (
                      <div key={req._id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <div className="flex-grow-1">
                            <h6>{req.medicineName}</h6>
                            <p><strong>Patient:</strong> {req.userName}</p>
                            <p>
                              <strong>Urgency:</strong>{' '}
                              <span className={`badge bg-${req.urgency === 'urgent' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>
                                {req.urgency}
                              </span>
                            </p>
                            <p>
                              <strong>Status:</strong>{' '}
                              <span className={`badge bg-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'danger'}`}>
                                {req.status}
                              </span>
                            </p>
                            <button className="btn btn-sm btn-outline-info mt-2" onClick={() => viewCustomerDetails(req)}>
                              View Customer Details
                            </button>
                          </div>
                          {req.status === 'pending' && (
                            <div className="ms-2">
                              <button className="btn btn-sm btn-success mb-1 w-100" onClick={() => updateRequestStatus(req._id, 'approved')}>
                                Approve
                              </button>
                              <button className="btn btn-sm btn-danger w-100" onClick={() => updateRequestStatus(req._id, 'rejected')}>
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCustomerModal && selectedCustomer && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Customer Details: {selectedCustomer.userName}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCustomerModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6>Personal Information</h6>
                        <p><strong>Name:</strong> {selectedCustomer.userName}</p>
                        <p><strong>User ID:</strong> {selectedCustomer.userId}</p>
                        <p><strong>Email:</strong> {selectedCustomer.userEmail || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6>Request Information</h6>
                        <p><strong>Medicine:</strong> {selectedCustomer.medicineName}</p>
                        <p><strong>Urgency:</strong> {selectedCustomer.urgency}</p>
                        <p><strong>Address:</strong> {selectedCustomer.billingAddress || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h6>Total Orders</h6>
                        <h3>{selectedCustomer.totalOrders || 0}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h6>Total Spent</h6>
                        <h3>₹{(selectedCustomer.totalSpent || 0).toLocaleString()}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-warning text-dark">
                      <div className="card-body text-center">
                        <h6>Status</h6>
                        <h3>{selectedCustomer.status}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <h6>Order History</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-dark">
                      <tr><th>Order ID</th><th>Medicine</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                        selectedCustomer.orders.map(order => (
                          <tr key={order._id}>
                            <td><code>{order._id.slice(-8)}</code></td>
                            <td>{order.medicineName}</td>
                            <td>₹{order.totalAmount?.toLocaleString()}</td>
                            <td><span className={`badge bg-${order.status === 'delivered' ? 'success' : 'warning'}`}>{order.status}</span></td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="text-center">No orders found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCustomerModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        body.dashboard-page-active #root { width: 100%; max-width: 100%; margin: 0; border-inline: none; padding: 0; }
        .modal.show { display: block; }
      `}</style>
    </div>
  );
};

export default Dashboard;