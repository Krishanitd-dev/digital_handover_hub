import "./components.css";

function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        Handover<span>Hub</span>
      </div>

      <nav className="sidebar-nav">

        <button
          className={`nav-item ${
            currentPage === "dashboard" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`nav-item ${
            currentPage === "myprojects" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("myprojects")}
        >
          My Projects
        </button>

        <button
          className={`nav-item ${
            currentPage === "handovers" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("handovers")}
        >
          Handovers
        </button>

        <button
          className={`nav-item ${
            currentPage === "takeovers" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("takeovers")}
        >
          Takeovers
        </button>
 
      <button
          className="nav-item"
          onClick={onLogout}
        >
           Logout
        </button>
        </nav>   
    </aside>
  );
}

export default Sidebar;