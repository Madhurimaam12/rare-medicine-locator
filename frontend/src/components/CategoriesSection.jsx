import React from 'react';

const CategoriesSection = ({ categories, onCategoryClick }) => {
  return (
    <div className="mt-3">
      <small className="text-muted">Browse by category:</small>
      <div className="row mt-2">
        {categories.map((cat, idx) => (
          <div className="col-md-6 col-lg-4 mb-2" key={idx}>
            <div className="card border-0" style={{ backgroundColor: 'var(--code-bg)' }}>
              <div className="card-body py-2">
                <strong style={{ color: 'var(--text-h)' }}>{cat.name}</strong>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {cat.medicines.map((med, medIdx) => (
                    <button key={medIdx} className="btn btn-link btn-sm p-0 me-2" style={{ textDecoration: 'none', color: 'var(--accent)' }} onClick={() => onCategoryClick(med)}>
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
  );
};

export default CategoriesSection;