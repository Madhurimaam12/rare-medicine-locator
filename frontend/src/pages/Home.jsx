import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import MedicineCompare from '../components/MedicineCompare';
import { medicineDetails, defaultDetails } from '../data/medicineDetails';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const pharmacyDetails = {
    pharmacy1: { name: "Apollo Pharmacy", phone: "+91-98765-43210", email: "apollo@raremed.com", address: "123, Main Road, Mumbai - 400001" },
    pharmacy2: { name: "MedPlus Pharmacy", phone: "+91-87654-32109", email: "medplus@raremed.com", address: "456, Park Street, Delhi - 110001" },
    pharmacy3: { name: "Wellness Pharmacy", phone: "+91-76543-21098", email: "wellness@raremed.com", address: "789, Brigade Road, Bangalore - 560001" }
  };

  useEffect(() => {
    document.body.classList.add('home-page-active');
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    fetchAllMedicines();
    return () => document.body.classList.remove('home-page-active');
  }, [userId]);

  const fetchAllMedicines = async () => {
    try {
      const response = await axios.get('https://rare-medicine-locator-main.onrender.com/api/medicines/search', { params: { q: '' } });
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

  const popularMedicines = [
    "Zolgensma", "Luxturna", "Hemgenix", "Elevidys", "Roctavian",
    "Lumizyme", "Naglazyme", "Aldurazyme", "Elaprase", "Vimizim",
    "Brineura", "Fabrazyme", "Cerezyme", "Vpriv",
    "Carbaglu", "Cystagon", "Myalept", "Orfadin", "Cystaran",
    "Kymriah", "Yescarta", "Breyanzi", "Tecartus",
    "Spinraza", "Evrysdi"
  ];

  const medicineCategories = [
    { name: "Gene Therapy", medicines: ["Zolgensma", "Luxturna", "Hemgenix", "Elevidys", "Roctavian"] },
    { name: "Enzyme Replacement", medicines: ["Lumizyme", "Naglazyme", "Aldurazyme", "Elaprase", "Vimizim", "Brineura", "Fabrazyme", "Cerezyme", "Vpriv"] },
    { name: "Metabolic Disorders", medicines: ["Carbaglu", "Cystagon", "Myalept", "Brineura", "Naglazyme", "Orfadin", "Cystaran"] },
    { name: "Cancer Therapy", medicines: ["Kymriah", "Yescarta", "Breyanzi", "Tecartus"] },
    { name: "SMA Treatment", medicines: ["Zolgensma", "Spinraza", "Evrysdi"] }
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = popularMedicines.filter(med => 
        med.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const performSearch = useCallback(async (searchValue, locationValue) => {
    if (!searchValue || searchValue.trim() === '') {
      fetchAllMedicines();
      setNoResults(false);
      return;
    }

    setLoading(true);
    try {
      const params = { q: searchValue };
      if (locationValue) params.location = locationValue;
      const response = await axios.get('https://rare-medicine-locator-main.onrender.com/api/medicines/search', { params });
      const medsWithPharmacy = response.data.map((med, index) => ({
        ...med,
        pharmacyInfo: pharmacyDetails[`pharmacy${(index % 3) + 1}`] || pharmacyDetails.pharmacy1
      }));
      setMedicines(medsWithPharmacy);
      setFilteredMedicines(medsWithPharmacy);
      setNoResults(medsWithPharmacy.length === 0);
      if (medsWithPharmacy.length === 0) toast.error(`No medicines found`);
      else toast.success(`Found ${medsWithPharmacy.length} medicine(s)`);
    } catch (error) { toast.error('Search failed'); } finally { setLoading(false); }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => performSearch(value, location), 500);
  };

  const handleSuggestionClick = (medicineName) => {
    setSearchTerm(medicineName);
    setShowSuggestions(false);
    performSearch(medicineName, location);
  };

  const handleCategoryClick = (medicineName) => {
    setSearchTerm(medicineName);
    performSearch(medicineName, location);
    toast.success(`Searching for ${medicineName}`);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    performSearch(searchTerm, value);
  };

  const handleManualSearch = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    performSearch(searchTerm, location);
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  const toggleFavorite = (medicineName) => {
    let newFavorites = favorites.includes(medicineName) 
      ? favorites.filter(f => f !== medicineName) 
      : [...favorites, medicineName];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
    toast.success(`${medicineName} ${favorites.includes(medicineName) ? 'removed from' : 'added to'} favorites`);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleRequest = (medicineName) => {
    navigate('/requests', { state: { medicineName } });
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="badge bg-danger">Out of Stock</span>;
    if (stock <= 5) return <span className="badge bg-warning text-dark">Low Stock ({stock} left)</span>;
    if (stock <= 10) return <span className="badge bg-info">Limited Stock</span>;
    return <span className="badge bg-success">In Stock ({stock})</span>;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold fs-4" href="#">Rare Medicine Locator</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto d-flex gap-2 align-items-center flex-wrap">
              <NotificationBell />
              <button className="btn btn-outline-light" onClick={toggleDarkMode} style={{ minWidth: '70px' }}>
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <span className="text-white">Welcome, {userName} ({userRole})</span>
              {userRole === 'pharmacy' && (
                <button className="btn btn-info text-white" onClick={() => navigate('/dashboard')}>Dashboard</button>
              )}
              {userRole === 'user' && (
                <button className="btn btn-outline-light" onClick={() => navigate('/my-orders')}>My Orders</button>
              )}
              <button className="btn btn-light" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-info text-white text-center py-5">
        <div className="container-fluid px-3 px-md-5">
          <h1 className="display-4">Find Rare Medicines Near You</h1>
          <p className="lead">Search across pharmacies and get notified when medicine is available</p>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-5 my-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-body p-4">
            <h5 className="text-center fw-bold mb-4">Search Medicine</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label fw-semibold">Medicine Name</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g., Zolgensma, Myalept"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="position-absolute w-100 border rounded-3 shadow-sm mt-1" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000, backgroundColor: 'var(--bg)' }}>
                      {suggestions.map((med, idx) => (
                        <button
                          key={idx}
                          className="btn w-100 text-start px-3 py-2 border-bottom"
                          style={{ borderRadius: 0, cursor: 'pointer', backgroundColor: 'var(--bg)', color: 'var(--text-h)' }}
                          onClick={() => handleSuggestionClick(med)}
                        >
                          <strong>{med}</strong>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Location</label>
                <select className="form-select form-select-lg" value={location} onChange={handleLocationChange} style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}>
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100 py-2" onClick={handleManualSearch} disabled={loading || !searchTerm}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold invisible d-none d-md-block">Sort</label>
                <select className="form-select" value={sortBy} onChange={handleSortChange} style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}>
                  <option value="name">Name</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <small className="text-muted">Popular searches:</small>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {popularMedicines.slice(0, 8).map(med => (
                  <button key={med} className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleCategoryClick(med)}>
                    {med}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <small className="text-muted">Browse by category:</small>
              <div className="row mt-2">
                {medicineCategories.map((cat, idx) => (
                  <div className="col-md-6 col-lg-4 mb-2" key={idx}>
                    <div className="card border-0" style={{ backgroundColor: 'var(--code-bg)' }}>
                      <div className="card-body py-2">
                        <strong style={{ color: 'var(--text-h)' }}>{cat.name}</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {cat.medicines.map((med, medIdx) => (
                            <button key={medIdx} className="btn btn-link btn-sm p-0 me-2" style={{ textDecoration: 'none', color: 'var(--accent)' }} onClick={() => handleCategoryClick(med)}>
                              {med}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {searchTerm && (
              <div className="mt-2 text-muted small">
                {loading ? 'Searching...' : `Showing results for: "${searchTerm}"${location ? ` in ${location}` : ''}`}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-5 my-5">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p>Searching...</p>
          </div>
        )}
        {!loading && noResults && (
          <div className="alert alert-warning text-center">
            <h5>No medicines found</h5>
            <p>Try a different medicine name or location</p>
          </div>
        )}
        {!loading && filteredMedicines.length > 0 && (
          <>
            <h3>Search Results ({filteredMedicines.length})</h3>
            <div className="row">
              {filteredMedicines.map(med => (
                <div className="col-md-6 col-lg-4 mb-4" key={med._id}>
                  <div className="card h-100 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title" style={{ color: 'var(--accent)' }}>{med.name}</h5>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleFavorite(med.name)}>
                          {favorites.includes(med.name) ? 'Remove Fav' : 'Add to Fav'}
                        </button>
                      </div>
                      <p className="card-text text-muted small">{med.genericName}</p>
                      <div className="mb-2">{getStockBadge(med.stock)}</div>
                      <hr style={{ borderColor: 'var(--border)' }} />
                      <p><strong>Manufacturer:</strong> {med.manufacturer}</p>
                      <p><strong>Location:</strong> {med.location}</p>
                      <p><strong>Price:</strong> ₹{med.price?.toLocaleString()}</p>
                      {med.pharmacyInfo && (
                        <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--code-bg)' }}>
                          <small className="fw-bold">Pharmacy:</small>
                          <small className="d-block text-muted">{med.pharmacyInfo.name}</small>
                          <small className="d-block text-muted">Phone: {med.pharmacyInfo.phone}</small>
                        </div>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-primary flex-grow-1" onClick={() => handleRequest(med.name)}>Request</button>
                        <button className="btn btn-outline-secondary" onClick={() => handleViewDetails(med)}>Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {!loading && !searchTerm && filteredMedicines.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">Enter a medicine name to start searching</h5>
          </div>
        )}
      </div>

      {showCompare && <MedicineCompare medicines={filteredMedicines} onClose={() => setShowCompare(false)} />}

      {showDetailsModal && selectedMedicine && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '800px' }}>
            <div className="modal-content" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
              <div className="modal-header" style={{ borderColor: 'var(--border)' }}>
                <h5 className="modal-title" style={{ color: 'var(--accent)' }}>{selectedMedicine.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {(() => {
                  // Case-insensitive lookup for medicine details
                  const medicineKey = Object.keys(medicineDetails).find(
                    key => key.toLowerCase() === selectedMedicine.name?.toLowerCase()
                  );
                  const details = medicineKey ? medicineDetails[medicineKey] : defaultDetails;
                  return (
                    <>
                      <div className="mb-4">
                        <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>What is this medicine?</h6>
                        <p>{details.description}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>What is it used for?</h6>
                        <p>{details.uses}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>How does it work?</h6>
                        <p>{details.mechanism}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>Common Side Effects</h6>
                        <p>{details.sideEffects}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold" style={{ color: 'var(--accent)' }}>Dosage Information</h6>
                        <p>{details.dosage}</p>
                      </div>
                      <hr style={{ borderColor: 'var(--border)' }} />
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Generic Name:</strong> {selectedMedicine.genericName || 'N/A'}</p>
                          <p><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Price:</strong> ₹{selectedMedicine.price?.toLocaleString()}</p>
                          <p><strong>Stock:</strong> {selectedMedicine.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                        </div>
                      </div>
                      {selectedMedicine.pharmacyInfo && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'var(--code-bg)' }}>
                          <h6 className="fw-bold mb-2">Pharmacy Contact</h6>
                          <p className="mb-1"><strong>Name:</strong> {selectedMedicine.pharmacyInfo.name}</p>
                          <p className="mb-1"><strong>Phone:</strong> {selectedMedicine.pharmacyInfo.phone}</p>
                          <p className="mb-0"><strong>Address:</strong> {selectedMedicine.pharmacyInfo.address}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="modal-footer" style={{ borderColor: 'var(--border)' }}>
                <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={() => { setShowDetailsModal(false); handleRequest(selectedMedicine.name); }}>Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-dark text-white text-center py-4 mt-5" style={{ backgroundColor: 'var(--accent)', width: '100%', margin: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <p className="mb-0">2026 Rare Medicine Locator | Helping patients find life-saving medicines</p>
        </div>
      </footer>

      <style>{`
        body.home-page-active #root { width: 100%; max-width: 100%; margin: 0; border-inline: none; padding: 0; }
        .card:hover { transform: translateY(-4px); transition: 0.2s; }
        .modal.show { display: block; }
      `}</style>
    </div>
  );
};

export default Home;