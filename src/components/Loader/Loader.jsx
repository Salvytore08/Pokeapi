const Loader = () => (
  <div className="d-flex justify-content-center py-5" role="status">
    <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }}>
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default Loader;
