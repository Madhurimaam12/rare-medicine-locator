import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const faqs = [
    { q: "How does Rare Medicine Locator work?", a: "Simply search for your medicine, and we'll show you nearby pharmacies that have it in stock. You can also request medicines if not available." },
    { q: "Is this app free to use?", a: "Yes! It's completely free for patients to search and request medicines." },
    { q: "How can I register my pharmacy?", a: "Click on 'Register' and select 'Pharmacy/Hospital' as your role. Fill in your details and start listing medicines." },
    { q: "What if a medicine is out of stock?", a: "You can raise a request. Pharmacies will be notified and can update you when it becomes available." },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      {/* Navigation Bar - Full Width Edge to Edge */}
      <nav className="navbar navbar-expand-lg shadow-sm fixed-top" style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)', width: '100%', margin: 0, borderRadius: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <a className="navbar-brand fw-bold text-primary fs-4" href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Rare Medicine Locator
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
                  How it works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>
                  FAQ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                  Contact
                </a>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary" 
                onClick={toggleDarkMode}
                style={{ minWidth: '70px' }}
              >
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Width Edge to Edge */}
      <section id="home" className="hero-section text-white" style={{ width: '100%', margin: 0, padding: 0, marginTop: '56px' }}>
        <div className="hero-overlay"></div>
        <div className="container-fluid px-3 px-md-5 py-5 text-center position-relative" data-aos="zoom-in" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <h1 className="display-4 fw-bold mb-3">
              Find Rare Medicines<br />Near You
            </h1>
            <p className="lead mb-4">The easiest way to locate life-saving rare medicines across trusted pharmacies.</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-light btn-lg px-4" onClick={() => navigate('/register')}>
                Get Started →
              </button>
              <button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate('/login')}>
                I'm a Pharmacy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Full Width */}
      <section className="container-fluid px-3 px-md-5 py-5" style={{ width: '100%', margin: 0 }}>
        <div className="row text-center g-4">
          <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="0">
            <div className="border rounded-3 py-4 shadow-sm hover-scale" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <h2 className="display-5 fw-bold text-primary">50+</h2>
              <p className="text-muted mb-0">Rare Medicines</p>
            </div>
          </div>
          <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="100">
            <div className="border rounded-3 py-4 shadow-sm hover-scale" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <h2 className="display-5 fw-bold text-primary">20+</h2>
              <p className="text-muted mb-0">Partner Pharmacies</p>
            </div>
          </div>
          <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="border rounded-3 py-4 shadow-sm hover-scale" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <h2 className="display-5 fw-bold text-primary">100+</h2>
              <p className="text-muted mb-0">Patients Served</p>
            </div>
          </div>
          <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="border rounded-3 py-4 shadow-sm hover-scale" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <h2 className="display-5 fw-bold text-primary">24/7</h2>
              <p className="text-muted mb-0">Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Full Width */}
      <section id="how-it-works" className="container-fluid px-3 px-md-5 py-5" style={{ backgroundColor: 'var(--code-bg)', width: '100%', margin: 0 }}>
        <div className="container-fluid px-0">
          <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: 'var(--text-h)' }}>How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-right" data-aos-delay="0">
              <div className="p-4 rounded-4 shadow-sm h-100 text-center hover-lift" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <span className="fs-1 fw-bold">1</span>
                </div>
                <h4 style={{ color: 'var(--text-h)' }}>Search for Medicine</h4>
                <p className="text-muted">Enter the name of the rare medicine you need. Our search will find where it's available.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="p-4 rounded-4 shadow-sm h-100 text-center hover-lift" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <span className="fs-1 fw-bold">2</span>
                </div>
                <h4 style={{ color: 'var(--text-h)' }}>Locate Pharmacy</h4>
                <p className="text-muted">See nearby pharmacies that have the medicine in stock, with contact details and location.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-left" data-aos-delay="400">
              <div className="p-4 rounded-4 shadow-sm h-100 text-center hover-lift" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <span className="fs-1 fw-bold">3</span>
                </div>
                <h4 style={{ color: 'var(--text-h)' }}>Get Medicine</h4>
                <p className="text-muted">Request the medicine or contact the pharmacy directly to get your life-saving medicine.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medicines - Full Width */}
      <section className="container-fluid px-3 px-md-5 py-5" style={{ width: '100%', margin: 0 }}>
        <div className="container-fluid px-0">
          <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: 'var(--text-h)' }}>Featured Rare Medicines</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="flip-left" data-aos-delay="0">
              <div className="card h-100 shadow-sm hover-scale border-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <img 
                  src="https://c7.alamy.com/comp/2F437TY/calgary-alberta-canada-march-15-2021-onasemnogene-abeparvovec-xioi-zolgensma-a-therapy-medication-used-for-sma-2F437TY.jpg" 
                  className="card-img-top" 
                  alt="Zolgensma"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">Zolgensma</h5>
                  <p className="card-text text-muted">For Spinal Muscular Atrophy (SMA)</p>
                  <span className="badge bg-danger">Life-Saving</span>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="flip-left" data-aos-delay="100">
              <div className="card h-100 shadow-sm hover-scale border-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <img 
                  src="https://www.grxstatic.com/d4fuqqd5l3dbz/products/cwf_tms/Package_41112.PNG?width=384&quality=95&auto=webp" 
                  className="card-img-top" 
                  alt="Myalept"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">Myalept</h5>
                  <p className="card-text text-muted">For Leptin Deficiency</p>
                  <span className="badge bg-warning text-dark">Rare Disease</span>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="flip-left" data-aos-delay="200">
              <div className="card h-100 shadow-sm hover-scale border-0" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <img 
                  src="https://tiimg.tistatic.com/fp/3/010/035/carbaglur-acido-tablets-200mg-512.jpg" 
                  className="card-img-top" 
                  alt="Carbaglu"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">Carbaglu</h5>
                  <p className="card-text text-muted">For Hyperammonemia</p>
                  <span className="badge bg-info">Emergency Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Full Width */}
      <section className="container-fluid px-3 px-md-5 py-5" style={{ backgroundColor: 'var(--code-bg)', width: '100%', margin: 0 }}>
        <div className="container-fluid px-0">
          <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: 'var(--text-h)' }}>What Our Users Say</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="0">
              <div className="bg-white p-4 rounded-4 shadow-sm hover-lift text-center" style={{ backgroundColor: 'var(--bg)' }}>
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Rajesh M."
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <p className="text-muted">"Found a life-saving medicine for my father within hours. Thank you!"</p>
                <div className="mt-3">
                  <strong style={{ color: 'var(--text-h)' }}>- Rajesh M.</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-white p-4 rounded-4 shadow-sm hover-lift text-center" style={{ backgroundColor: 'var(--bg)' }}>
                <img 
                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                  alt="Dr. Priya S."
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <p className="text-muted">"As a pharmacist, this platform helps me serve patients better. Very useful!"</p>
                <div className="mt-3">
                  <strong style={{ color: 'var(--text-h)' }}>- Dr. Priya S.</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-white p-4 rounded-4 shadow-sm hover-lift text-center" style={{ backgroundColor: 'var(--bg)' }}>
                <img 
                  src="https://randomuser.me/api/portraits/women/45.jpg" 
                  alt="Anita K."
                  className="rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <p className="text-muted">"Quick, reliable, and easy to use. Highly recommend for rare disease patients."</p>
                <div className="mt-3">
                  <strong style={{ color: 'var(--text-h)' }}>- Anita K.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Full Width */}
      <section id="faq" className="container-fluid px-3 px-md-5 py-5" style={{ width: '100%', margin: 0 }}>
        <div className="container-fluid px-0">
          <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: 'var(--text-h)' }}>Frequently Asked Questions</h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-bottom mb-3 pb-3" data-aos="fade-up" data-aos-delay={idx * 100} style={{ borderColor: 'var(--border)' }}>
                  <div className="d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
                    <h5 className="mb-0" style={{ color: 'var(--text-h)' }}>{faq.q}</h5>
                    <span className="fs-5 rotate-animation" style={{ color: 'var(--text-h)' }}>{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  {activeFaq === idx && (
                    <p className="text-muted mt-2 mb-0 slide-down">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Full Width Edge to Edge */}
      <section id="contact" className="bg-dark text-white py-5" data-aos="fade-up" style={{ width: '100%', margin: 0 }}>
        <div className="container-fluid px-3 px-md-5">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold">Rare Medicine Locator</h3>
              <p className="text-white-50">Helping patients find life-saving medicines across India.</p>
              <p className="text-white-50 mt-3">Emergency Helpline: +91-123-456-7890</p>
              <p className="text-white-50">Email: support@raremedicinelocator.com</p>
            </div>
            <div className="col-md-6">
              <h5>Quick Links</h5>
              <div className="d-flex flex-column">
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => scrollToSection('home')}>Home</a>
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => scrollToSection('how-it-works')}>How It Works</a>
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => scrollToSection('faq')}>FAQ</a>
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => scrollToSection('contact')}>Contact</a>
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => navigate('/login')}>Login</a>
                <a href="#" className="text-white-50 text-decoration-none mb-2" onClick={() => navigate('/register')}>Register</a>
              </div>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="text-center text-white-50">
            <p className="mb-0">© 2026 Rare Medicine Locator. All rights reserved.</p>
          </div>
        </div>
      </section>

      <style>{`
        /* Remove borders from root for landing page only */
        body.landing-page-active #root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          border-inline: none;
          padding: 0;
        }
        
        body.landing-page-active {
          overflow-x: hidden;
        }
        
        .hero-section {
          background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=600&fit=crop');
          background-size: cover;
          background-position: center;
          position: relative;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.92) 0%, rgba(118, 75, 162, 0.92) 100%);
        }
        
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .hover-scale:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }
        
        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        
        .rotate-animation {
          transition: transform 0.3s ease;
          display: inline-block;
        }
        .rotate-animation:hover {
          transform: rotate(90deg);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .nav-link {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Landing;
