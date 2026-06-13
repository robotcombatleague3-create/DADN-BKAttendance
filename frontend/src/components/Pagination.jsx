import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-3 mt-2" style={{ gap: '8px' }}>
      <button 
        className="btn btn-link text-decoration-none text-secondary d-flex align-items-center"
        style={{ gap: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      >
        <span>&larr;</span> Trước
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-secondary fw-bold px-1">...</span>
          ) : (
            <button
              className={`btn border-0 fw-medium ${currentPage === page ? 'bg-dark text-white' : 'text-secondary bg-transparent'}`}
              style={{ 
                width: '36px', height: '36px', 
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button 
        className="btn btn-link text-decoration-none text-secondary d-flex align-items-center"
        style={{ gap: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      >
        Sau <span>&rarr;</span>
      </button>
    </div>
  );
};

export default Pagination;
