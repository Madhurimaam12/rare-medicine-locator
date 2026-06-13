import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import MedicineCompare from '../components/MedicineCompare';
import MedicineCard from '../components/MedicineCard';
import SearchBar from '../components/SearchBar';
import CategoriesSection from '../components/CategoriesSection';
import ViewDetailsModal from '../components/ViewDetailsModal';
import { popularMedicines, medicineCategories } from '../data/medicineDetails';
import { pharmacyDetails } from '../data/pharmacyDetails';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const debounceTimeout = useRef(null);
  
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    document.body.classList.add('home-page-active');
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    fetchAllMedicines();
    return () => document.body.classList.remove('home-page-active');
  }, [userId]);

  const fetchAllMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicines/search', { params: { q: '' } });
      const medsWithPharmacy = response.data.map((med, index) => ({
        ...med,
        pharmacyInfo: pharmacyDetails[`pharmacy${(index % 3) + 1}`] || pharmacyDetails.pharmacy1
      }));
      setMedicines(medsWithPharmacy);
      setFilteredMedicines(medsWithPharmacy);
    } catch (error) { console.error('Failed to fetch:', error); }
  };

  useEffect(() => {
    const sorted = [...medicines].sort((a, b) => {
      switch(sortBy) {
        case 'price_low': return (a.price || 0) - (b.price || 0);
        case 'price_high': return (b.price || 0) - (a.price || 0);
        case 'stock': return (b.stock || 0) - (a.stock || 0);
        default: return (a.name || '').localeCompare(b.name || '');
      }
    });
    setFilteredMedicines(sorted);
  }, [medicines, sortBy]);

  const performSearch = useCallback(async (searchValue, locationValue) => {
    if (!searchValue?.trim()) { fetchAllMedicines(); setNoResults(false); return; }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/medicines/search', { params: { q: searchValue, location: locationValue || undefined } });
      const medsWithPharmacy = response.data.map((med, index) => ({ ...med, pharmacyInfo: pharmacyDetails[`pharmacy${(index % 3) + 1}`] || pharmacyDetails.pharmacy1 }));
      setMedicines(medsWithPharmacy);
      setFilteredMedicines(medsWithPharmacy);
      setNoResults(medsWithPharmacy.length === 0);
      if (medsWithPharmacy.length === 0) toast.error(`No medicines found for "${searchValue}"`);
      else toast.success(`Found ${medsWithPharmacy.length} medicine(s)`);
    } catch (error) { toast.error('Search failed'); } finally { setLoading(false); }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => performSearch(value, location), 500);
  };

  const handleCategoryClick = (medicineName) => { setSearchTerm(medicineName); performSearch(medicineName, location); toast.success(`Searching for ${medicineName}`); };
  const handleLocationChange = (e) => { setLocation(e.target.value); performSearch(searchTerm, e.target.value); };
  const handleManualSearch = () => performSearch(searchTerm, location);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleFavorite = (name) => {
    let newFavorites = favorites.includes(name) ? favorites.filter(f => f !== name) : [...favorites, name];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
    toast.success(`${name} ${favorites.includes(name) ? 'removed from' : 'added to'} favorites`);
  };
  const handleLogout = () => { localStorage.clear(); toast.success('Logged out'); navigate('/login'); };
  const handleRequest = (name) => navigate('/requests', { state: { medicineName: name } });
  const handleViewDetails = (medicine) => { setSelectedMedicine(medicine); setShowDetailsModal(true); };
  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="badge bg-danger">Out of Stock</span>;
    if (stock <= 5) return <span className="badge bg-warning text-dark">Low Stock ({stock} left)</span>;
    return <span className="badge bg-success">In Stock ({stock})</span>;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Rare Medicine Locator</a>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <NotificationBell />
            <button className="btn btn-outline-light" onClick={toggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
            <span className="text-white">Welcome, {userName} ({userRole})</span>
            {userRole === 'pharmacy' && <button className="btn btn-info" onClick={() => navigate('/dashboard')}>Dashboard</button>}
            {userRole === 'user' && <button className="btn btn-outline-light" onClick={() => navigate('/my-orders')}>My Orders</button>}
            <button className="btn btn-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="bg-info text-white text-center py-5"><h1>Find Rare Medicines Near You</h1><p>Search across pharmacies and get notified when medicine is available</p></div>

      <div className="container-fluid px-3 px-md-5 my-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-body p-4">
            <h5 className="text-center fw-bold mb-4">Search Medicine</h5>
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} location={location} onLocationChange={handleLocationChange} onManualSearch={handleManualSearch} loading={loading} sortBy={sortBy} onSortChange={handleSortChange} />
            <div className="mt-4"><small className="text-muted">Popular searches:</small><div className="d-flex flex-wrap gap-2 mt-2">{popularMedicines.slice(0, 8).map(med => <button key={med} className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleCategoryClick(med)}>{med}</button>)}</div></div>
            <CategoriesSection categories={medicineCategories} onCategoryClick={handleCategoryClick} />
            {searchTerm && <div className="mt-2 text-muted small">{loading ? 'Searching...' : `Showing results for: "${searchTerm}"${location ? ` in ${location}` : ''}`}</div>}
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-5 my-5">
        {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Searching...</p></div>}
        {!loading && noResults && <div className="alert alert-warning text-center"><h5>No medicines found</h5><p>Try a different medicine name or location</p></div>}
        {!loading && filteredMedicines.length > 0 && (
          <>
            <h3>Search Results ({filteredMedicines.length})</h3>
            <div className="row">{filteredMedicines.map(med => <MedicineCard key={med._id} medicine={med} favorites={favorites} onToggleFavorite={toggleFavorite} onRequest={handleRequest} onViewDetails={handleViewDetails} getStockBadge={getStockBadge} />)}</div>
          </>
        )}
        {!loading && !searchTerm && filteredMedicines.length === 0 && <div className="text-center py-5"><h5 className="text-muted">Enter a medicine name to start searching</h5></div>}
      </div>

      {showCompare && <MedicineCompare medicines={filteredMedicines} onClose={() => setShowCompare(false)} />}
      {showDetailsModal && <ViewDetailsModal medicine={selectedMedicine} onClose={() => setShowDetailsModal(false)} onRequest={handleRequest} />}

      <footer className="bg-dark text-white text-center py-4 mt-5"><p>2026 Rare Medicine Locator | Helping patients find life-saving medicines</p></footer>
      <style>{`body.home-page-active #root { width: 100%; max-width: 100%; margin: 0; border-inline: none; padding: 0; } .card:hover { transform: translateY(-4px); transition: 0.2s; }`}</style>
    </div>
  );
};

export default Home;