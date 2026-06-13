import React from 'react';

const RequestsList = ({ requests, onApprove, onReject, onViewCustomer }) => {
  return (
    <div className="card shadow">
      <div className="card-header bg-info text-white">
        <h4>Patient Requests ({requests.length})</h4>
      </div>
      <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {requests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          <div className="list-group">
            {requests.map((req) => (
              <div key={req._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div className="flex-grow-1">
                    <h6>{req.medicineName}</h6>
                    <p className="mb-1"><strong>Patient:</strong> {req.userName}</p>
                    <p className="mb-1">
                      <strong>Urgency:</strong>{' '}
                      <span className={`badge bg-${req.urgency === 'urgent' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>
                        {req.urgency}
                      </span>
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong>{' '}
                      <span className={`badge bg-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'danger'}`}>
                        {req.status}
                      </span>
                    </p>
                    {req.billingAddress && (
                      <p className="mb-1 small text-muted">
                        <strong>Address:</strong> {req.billingAddress}
                      </p>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-info mt-2"
                      onClick={() => onViewCustomer(req)}
                    >
                      View Customer Details
                    </button>
                  </div>
                  {req.status === 'pending' && (
                    <div className="ms-2">
                      <button className="btn btn-sm btn-success mb-1 w-100" onClick={() => onApprove(req._id)}>
                        Approve
                      </button>
                      <button className="btn btn-sm btn-danger w-100" onClick={() => onReject(req._id)}>
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
  );
};

export default RequestsList;