import React from 'react';

const CustomerDetailsModal = ({ customer, onClose }) => {
    if (!customer) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Customer Details: {customer.userName}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Personal Information</h6>
                                        <p className="mb-1"><strong>Name:</strong> {customer.userName}</p>
                                        <p className="mb-1"><strong>User ID:</strong> {customer.userId}</p>
                                        <p className="mb-1"><strong>Email:</strong> {customer.userEmail || 'Not provided'}</p>
                                        <p className="mb-0"><strong>Request Date:</strong> {new Date(customer.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Request Information</h6>
                                        <p className="mb-1"><strong>Medicine:</strong> {customer.medicineName}</p>
                                        <p className="mb-1"><strong>Urgency:</strong> {customer.urgency}</p>
                                        <p className="mb-1"><strong>Status:</strong> {customer.status}</p>
                                        <p className="mb-0"><strong>Address:</strong> {customer.billingAddress || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <div className="card bg-success text-white">
                                    <div className="card-body text-center">
                                        <h6>Total Orders</h6>
                                        <h3>{customer.totalOrders || 0}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card bg-info text-white">
                                    <div className="card-body text-center">
                                        <h6>Total Spent</h6>
                                        <h3>₹{(customer.totalSpent || 0).toLocaleString()}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card bg-warning text-dark">
                                    <div className="card-body text-center">
                                        <h6>Request Status</h6>
                                        <h3>{customer.status}</h3>
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
                                    {customer.orders && customer.orders.length > 0 ? (
                                        customer.orders.map(order => (
                                            <tr key={order._id}>
                                                <td><code>{order._id.slice(-8)}</code></td>
                                                <td>{order.medicineName}</td>
                                                <td>₹{order.totalAmount?.toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                        {order.status}
                                                    </span>
                                                    {order.rating && (
                                                        <span className="badge bg-primary ms-1">Rating: {order.rating}/5</span>
                                                    )}
                                                </td>
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
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;