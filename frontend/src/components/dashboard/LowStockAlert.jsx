import React from 'react';

const LowStockAlert = ({ lowStockMedicines }) => {
  if (lowStockMedicines.length === 0) return null;
  
  return (
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
  );
};

export default LowStockAlert;