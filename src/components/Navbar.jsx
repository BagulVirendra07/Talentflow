import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px", background: "#f0f0f0" }}>
      <Link to="/jobs">Jobs</Link>
      <Link to="/candidates">Candidates</Link>
      <Link to="/assessments">Assessments</Link>
    </nav>
  );
}

export default Navbar;
