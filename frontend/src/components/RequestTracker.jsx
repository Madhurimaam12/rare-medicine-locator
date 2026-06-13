import React from 'react';

const RequestTracker = ({ status }) => {
  const steps = ['Requested', 'Pharmacy View', 'Approved', 'Dispatched', 'Delivered'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-2">
        {steps.map((step, idx) => (
          <div key={idx} className="text-center" style={{ flex: 1 }}>
            <div className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${idx <= currentIndex ? 'bg-success' : 'bg-secondary'}`} style={{ width: '30px', height: '30px', color: 'white' }}>
              {idx < currentIndex ? '✓' : idx + 1}
            </div>
            <small className={idx <= currentIndex ? 'text-success' : 'text-muted'}>{step}</small>
          </div>
        ))}
      </div>
      <div className="progress">
        <div className="progress-bar bg-success" style={{ width: `${(currentIndex + 1) / steps.length * 100}%` }}></div>
      </div>
    </div>
  );
};

export default RequestTracker;