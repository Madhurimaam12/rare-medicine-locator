import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import AddMedicineForm from '../components/dashboard/AddMedicineForm';
import MedicineList from '../components/dashboard/MedicineList';
import RequestsList from '../components/dashboard/RequestsList';
import CustomerDetailsModal from '../components/dashboard/CustomerDetailsModal';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const navigate = useNavigate();

  const pharmacyId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.body.classList.add('dashboard-page-active');
    fetchMedicines();
    fetchRequests();
    fetchOrders();
    return () => document.body.classList.remove('dashboard-page-active');
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicines/my-medicines/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRequests(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) { console.error(error); }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockMedicines = medicines.filter(m => m.stock <= 5);
  const pendingApprovals = allRequests.filter(r => r.status === 'pending').length;

  const handleAddMedicine = async (medicine) => {
    try {
      await axios.post('http://localhost:5000/api/medicines', { ...medicine, pharmacyId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Medicine added successfully!');
      setShowForm(false);
      fetchMedicines();
    } catch (error) { toast.error('Failed to add medicine'); }
  };

  const updateStock = async (id, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock !== null && !isNaN(parseInt(newStock))) {
      try {
        await axios.put(`http://localhost:5000/api/medicines/${id}/stock`, { stock: parseInt(newStock) }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Stock updated');
        fetchMedicines();
      } catch (error) { toast.error('Failed to update stock'); }
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error) { toast.error('Failed to update status'); }
  };

  const exportOrdersToExcel = () => {
    const exportData = orders.map(order => ({
      'Order ID': order._id.slice(-8),
      'Patient Name': order.userName,
      'Medicine': order.medicineName,
      'Amount': order.totalAmount,
      'Payment Status': order.paymentStatus,
      'Payment Mode': order.paymentMode,
      'Order Status': order.status,
      'Order Date': new Date(order.orderDate).toLocaleDateString(),
      'Delivery By': new Date(order.deliveryByDate).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Orders exported successfully!');
  };

  const viewCustomerDetails = (customer) => {
    const customerOrders = orders.filter(o => o.userId === customer.userId);
    setSelectedCustomer({ ...customer, orders: customerOrders, totalOrders: customerOrders.length, totalSpent: customerOrders.reduce((sum, o) => sum + o.totalAmount, 0) });
    setShowCustomerModal(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Pharmacy Dashboard</a>
          <div className="ms-auto">
            <button className="btn btn-secondary me-2" onClick={() => navigate('/pharmacy-orders')}>View Orders</button>
            <button className="btn btn-light" onClick={() => navigate('/')}>Back to Search</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-5 my-5" style={{ width: '100%', margin: 0 }}>
        <StatisticsCards medicines={medicines.length} totalOrders={totalOrders} totalRevenue={totalRevenue} pendingApprovals={pendingApprovals} />
        <LowStockAlert lowStockMedicines={lowStockMedicines} />

        <div className="row mb-4">
          <div className="col-12">
            <button className="btn btn-success me-2" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add New Medicine'}
            </button>
            <button className="btn btn-secondary" onClick={exportOrdersToExcel}>Export Orders to Excel</button>
          </div>
        </div>

        {showForm && <AddMedicineForm onSubmit={handleAddMedicine} onCancel={() => setShowForm(false)} />}

        <div className="row">
          <div className="col-md-6">
            <MedicineList medicines={medicines} onUpdateStock={updateStock} />
          </div>
          <div className="col-md-6">
            <RequestsList requests={allRequests} onApprove={(id) => updateRequestStatus(id, 'approved')} onReject={(id) => updateRequestStatus(id, 'rejected')} onViewCustomer={viewCustomerDetails} />
          </div>
        </div>
      </div>

      {showCustomerModal && <CustomerDetailsModal customer={selectedCustomer} onClose={() => setShowCustomerModal(false)} />}

      <style>{`
        body.dashboard-page-active #root { width: 100%; max-width: 100%; margin: 0; border-inline: none; padding: 0; }
        body.dashboard-page-active { overflow-x: hidden; }
        .modal.show { display: block; }
      `}</style>
    </div>
  );
};

export default Dashboard;