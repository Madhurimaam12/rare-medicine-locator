import React from 'react';

const MedicineCard = ({ medicine, favorites, onToggleFavorite, onRequest, onViewDetails, getStockBadge }) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title" style={{ color: 'var(--accent)' }}>{medicine.name}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onToggleFavorite(medicine.name)}>
              {favorites.includes(medicine.name) ? 'Remove Fav' : 'Add to Fav'}
            </button>
          </div>
          <p className="card-text text-muted small">{medicine.genericName}</p>
          <div className="mb-2">{getStockBadge(medicine.stock)}</div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
          <p><strong>Location:</strong> {medicine.location}</p>
          <p><strong>Price:</strong> ₹{medicine.price?.toLocaleString()}</p>
          
          {medicine.pharmacyInfo && (
            <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--code-bg)' }}>
              <small className="fw-bold">Pharmacy Contact:</small>
              <small className="d-block text-muted">{medicine.pharmacyInfo.name}</small>
              <small className="d-block text-muted">Phone: {medicine.pharmacyInfo.phone}</small>
            </div>
          )}
          
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary flex-grow-1" onClick={() => onRequest(medicine.name)}>Request This Medicine</button>
            <button className="btn btn-outline-secondary" onClick={() => onViewDetails(medicine)}>View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;