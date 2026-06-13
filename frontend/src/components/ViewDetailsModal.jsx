import React from 'react';
import { medicineDetails } from '../data/medicineDetails';

const defaultDetails = {
  description: "This is a rare medicine used to treat a specific medical condition.",
  uses: "Treatment of rare genetic or metabolic disorders",
  mechanism: "Targets specific molecular pathways involved in the disease process.",
  sideEffects: "Consult your healthcare provider for potential side effects.",
  dosage: "As prescribed by your healthcare provider."
};

const ViewDetailsModal = ({ medicine, onClose, onRequest }) => {
  if (!medicine) return null;
  
  const details = medicineDetails[medicine.name] || defaultDetails;
  
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '800px' }}>
        <div className="modal-content" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
          <div className="modal-header" style={{ borderColor: 'var(--border)' }}>
            <h5 className="modal-title" style={{ color: 'var(--accent)' }}>{medicine.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>What is this medicine?</h6>
              <p className="mb-0">{details.description}</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>What is it used for?</h6>
              <p className="mb-0">{details.uses}</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>How does it work?</h6>
              <p className="mb-0">{details.mechanism}</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>Common Side Effects</h6>
              <p className="mb-0">{details.sideEffects}</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>Dosage Information</h6>
              <p className="mb-0">{details.dosage}</p>
            </div>
            <hr style={{ borderColor: 'var(--border)' }} />
            <div className="row">
              <div className="col-md-6">
                <p><strong>Generic Name:</strong> {medicine.genericName || 'N/A'}</p>
                <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Price:</strong> ₹{medicine.price?.toLocaleString()}</p>
                <p><strong>Stock:</strong> {medicine.stock > 0 ? `${medicine.stock} units available` : 'Out of Stock'}</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'var(--code-bg)' }}>
              <h6 className="fw-bold mb-2">Pharmacy Contact Information</h6>
              <p className="mb-1"><strong>Name:</strong> {medicine.pharmacyInfo?.name}</p>
              <p className="mb-1"><strong>Phone:</strong> {medicine.pharmacyInfo?.phone}</p>
              <p className="mb-1"><strong>Address:</strong> {medicine.pharmacyInfo?.address}</p>
            </div>
          </div>
          <div className="modal-footer" style={{ borderColor: 'var(--border)' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={() => { onClose(); onRequest(medicine.name); }}>Request This Medicine</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;