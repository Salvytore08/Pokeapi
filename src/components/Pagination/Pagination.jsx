import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

const Pagination = ({ page, pageCount, onChange }) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      forcePage={page - 1}
      pageCount={pageCount}
      onPageChange={({ selected }) => onChange(selected + 1)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      previousLabel="‹"
      nextLabel="›"
      breakLabel="…"
      containerClassName="pagination justify-content-center flex-wrap my-4"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      disabledClassName="disabled"
    />
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
