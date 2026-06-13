import React from 'react';

const AddMedicineForm = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const medicine = {
      name: formData.get('name'),
      genericName: formData.get('genericName'),
      manufacturer: formData.get('manufacturer'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      location: formData.get('location'),
    };
    onSubmit(medicine);
  };

  return (
    <div className="card mb-4 shadow">
      <div className="card-header bg-success text-white">
        <h4>Add New Medicine</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
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
              <input type="text" name="location" className="form-control" placeholder="Location (City)" required />
            </div>
            <div className="col-md-12">
              <button type="submit" className="btn btn-success">Save Medicine</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineForm;