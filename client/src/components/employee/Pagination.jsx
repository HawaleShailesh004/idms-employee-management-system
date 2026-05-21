import './Pagination.css';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <button
        type="button"
        className={`pagination__btn ${canPrev ? '' : 'pagination__btn--disabled'}`}
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        -&gt;
      </button>
      <span className="pagination__label">Page</span>
      <span className="pagination__current">{page}</span>
      <button
        type="button"
        className={`pagination__btn pagination__btn--next ${canNext ? '' : 'pagination__btn--disabled'}`}
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        -&gt;
      </button>
    </div>
  );
};

export default Pagination;
