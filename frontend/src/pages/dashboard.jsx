import "./dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";


function Dashboard({ user, currentPage, setCurrentPage }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-NZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-layout">
      <Sidebar  currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      <div className="dashboard-main">
      <Topbar user={user} />
      <main className="dashboard-content">
          
       
        <section className="welcome-section">
        <p className="date-label"> {formattedDate}
          </p>
          <h1>Good morning, {user.displayName}</h1>
         <p className="welcome-text"> Here's an overview of projects and handovers across your team.</p>
          </section>

          
          <section className="stats-grid">
            <StatCard
              number="—"
              label="Active Projects"/>
            <StatCard
              number="—"
              label="Active Handovers"/>
            <StatCard
              number="—"
              label="Waiting for Takeover"/>
            <StatCard
              number="—"
              label="Overdue"/>
          </section>

          
          <section className="dashboard-section">
            <div className="section-header">
            <div>
            <h2>Team Projects</h2>
            <p>Projects currently being managed across the team.</p>
            </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">
                📁
              </div>
              <h3>No projects yet</h3>
              <p>Projects created by team members will appear here.</p>
           </div>
          </section>


          
          <section className="dashboard-section">
            <div className="section-header">
              <div><h2>Handover Activity</h2>
              <p>  Recent project handovers and takeovers across the team. </p>
            </div>
            </div>

            <div className="empty-state">
            <div className="empty-icon"> ↗
            </div>
            <h3>No handover activity</h3>
          <p>Handover activity will appear here when a project is transferred.</p>
        </div>
      </section>
      </main>
      </div>
    </div>
  );
}
export default Dashboard;
