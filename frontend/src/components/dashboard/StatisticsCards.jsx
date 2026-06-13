import React from 'react';

const StatisticsCards = ({ medicines, totalOrders, totalRevenue, pendingApprovals }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-3 mb-3">
        <div className="card bg-primary text-white shadow">
          <div className="card-body">
            <h6>Total Medicines</h6>
            <h2>{medicines}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-success text-white shadow">
          <div className="card-body">
            <h6>Total Orders</h6>
            <h2>{totalOrders}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-info text-white shadow">
          <div className="card-body">
            <h6>Total Revenue</h6>
            <h2>₹{totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-warning text-dark shadow">
          <div className="card-body">
            <h6>Pending Approvals</h6>
            <h2>{pendingApprovals}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;