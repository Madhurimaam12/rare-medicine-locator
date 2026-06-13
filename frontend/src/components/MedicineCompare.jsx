import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';

const MedicineCompare = ({ medicines, onClose }) => {
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  const handleSelect = (medicine) => {
    if (selectedMedicines.includes(medicine)) {
      setSelectedMedicines(selectedMedicines.filter(m => m !== medicine));
    } else if (selectedMedicines.length < 3) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    } else {
      toast.error('Can only compare up to 3 medicines');
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title> Compare Medicines</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6>Select medicines to compare (max 3):</h6>
          <div className="d-flex flex-wrap gap-2">
            {medicines.map(med => (
              <button
                key={med._id}
                className={`btn btn-sm ${selectedMedicines.includes(med) ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handleSelect(med)}
              >
                {med.name}
              </button>
            ))}
          </div>
        </div>

        {selectedMedicines.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Feature</th>
                {selectedMedicines.map(med => <th key={med._id}>{med.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td>Generic Name</td>{selectedMedicines.map(med => <td>{med.genericName || 'N/A'}</td>)}</tr>
              <tr><td>Manufacturer</td>{selectedMedicines.map(med => <td>{med.manufacturer}</td>)}</tr>
              <tr><td>Price (₹)</td>{selectedMedicines.map(med => <td>₹{med.price?.toLocaleString()}</td>)}</tr>
              <tr><td>Stock</td>{selectedMedicines.map(med => <td className={med.stock > 0 ? 'text-success' : 'text-danger'}>{med.stock > 0 ? `In Stock (${med.stock})` : 'Out of Stock'}</td>)}</tr>
              <tr><td>Location</td>{selectedMedicines.map(med => <td>{med.location}</td>)}</tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicineCompare;