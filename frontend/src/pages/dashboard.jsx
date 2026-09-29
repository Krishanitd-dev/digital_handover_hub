import "./dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";


function Dashboard({ user, currentPage, setCurrentPage, onLogout, }) {
  const [projects, setProjects] = useState([]);

useEffect(() => {
  fetch("http://localhost:5134/api/projects")
    .then((response) => response.json())
    .then((data) => {
      setProjects(data);
    })
    .catch((error) => {
      console.error("Error loading dashboard projects:", error);
    });
}, []);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-NZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-layout">
      <Sidebar  currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout}/>
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
            {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No projects yet</h3>
              <p>Projects created by team members will appear here.</p>
              </div>
              ) : (
                <div className="team-projects-list">
              {projects.map((project) => (
              <div className="team-project-card" key={project.id}>

              <div className="team-project-header">
             <div>
            <h3>{project.projectName}</h3>
            <p>{project.description}</p>
          </div>

          <span className="project-priority">
            {project.priority}
          </span>
        </div>

        <div className="team-project-details">

          <div>
            <span>Owner</span>
            <strong>{project.owner}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{project.status}</strong>
          </div>

          <div>
            <span>Progress</span>
            <strong>{project.progress}%</strong>
          </div>

          <div>
            <span>Expected Completion</span>
            <strong>{project.expectedCompletion}</strong>
          </div>

        </div>

        <div className="dashboard-progress-bar">
          <div
            className="dashboard-progress-fill"
            style={{
              width: `${project.progress}%`,
            }}
          ></div>
            </div>

          </div>
             ))}
            </div>
          )}
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
