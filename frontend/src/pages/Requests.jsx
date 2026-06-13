import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Requests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState(location.state?.medicineName || '');
  const [urgency, setUrgency] = useState('normal');
  const [billingAddress, setBillingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!billingAddress.trim()) {
      toast.error('Please enter your billing address');
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/requests', {
        medicineName,
        userId,
        userName,
        userEmail,
        phoneNumber,
        urgency,
        location: 'Unknown',
        billingAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Request submitted successfully!');
      toast.success('Request submitted! Pharmacy will be notified.');
      setTimeout(() => setMessage(''), 3000);
      setMedicineName('');
      setBillingAddress('');
      setPhoneNumber('');
      fetchMyRequests();
    } catch (error) {
      toast.error('Failed to submit request');
      setMessage('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getUrgencyBadge = (urgency) => {
    const colors = { urgent: 'danger', high: 'warning', normal: 'info' };
    return <span className={`badge bg-${colors[urgency] || 'secondary'}`}>{urgency}</span>;
  };

  const getStatusBadge = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={() => navigate('/')}>Rare Medicine Locator</a>
          <button className="btn btn-light" onClick={() => navigate('/')}>Back to Search</button>
        </div>
      </nav>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Request a Medicine</h4>
              </div>
              <div className="card-body">
                {message && <div className="alert alert-success">{message}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <small className="text-muted">Pharmacy will contact you on this number</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Billing Address *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter your complete address for delivery/billing"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Urgency Level</label>
                    <select className="form-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                      <option value="normal">Normal (3-5 days)</option>
                      <option value="high">High (1-2 days)</option>
                      <option value="urgent">Urgent (Within 24 hours)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">My Requests</h4>
              </div>
              <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {myRequests.length === 0 ? (
                  <p className="text-muted">No requests yet</p>
                ) : (
                  <div className="list-group">
                    {myRequests.map((req) => (
                      <div key={req._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1">{req.medicineName}</h6>
                          {getUrgencyBadge(req.urgency)}
                        </div>
                        {req.phoneNumber && (
                          <p className="mb-1 small">Phone: {req.phoneNumber}</p>
                        )}
                        {req.billingAddress && (
                          <p className="mb-1 small text-muted">Address: {req.billingAddress.substring(0, 50)}...</p>
                        )}
                        <small className="text-muted">
                          Requested on: {new Date(req.createdAt).toLocaleDateString()}
                        </small>
                        <div className="mt-2">
                          Status: {getStatusBadge(req.status)}
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
    </div>
  );
};

export default Requests;