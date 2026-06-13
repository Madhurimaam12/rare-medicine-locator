import React from 'react';

const MedicineList = ({ medicines, onUpdateStock }) => {
  return (
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
                    <p className="mb-1">{med.manufacturer} - ₹{med.price?.toLocaleString()}</p>
                    <p className="mb-1">Location: {med.location}</p>
                  </div>
                  <div className="text-end">
                    <span className={med.stock > 0 ? 'text-success' : 'text-danger'}>
                      Stock: {med.stock}
                    </span>
                    {med.stock <= 5 && med.stock > 0 && (
                      <span className="badge bg-warning text-dark ms-2 d-block mt-1">Low Stock!</span>
                    )}
                    {med.stock === 0 && (
                      <span className="badge bg-danger ms-2 d-block mt-1">Out of Stock!</span>
                    )}
                  </div>
                </div>
                <button className="btn btn-sm btn-primary mt-2" onClick={() => onUpdateStock(med._id, med.stock)}>
                  Update Stock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineList;