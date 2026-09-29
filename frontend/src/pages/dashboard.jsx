import "./dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";

function Dashboard({ user, currentPage, setCurrentPage, onLogout, }) {
  const [projects, setProjects] = useState([]);
  const [handovers, setHandovers] = useState([]);
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

useEffect(() => {
  fetch("http://localhost:5134/api/handovers")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load handovers");
      }

      return response.json();
    })
    .then((data) => {
      setHandovers(data);
    })
    .catch((error) => {
      console.error("Error loading handovers:", error);
    });
}, []);

const activeHandovers = handovers.filter(
  (handover) => handover.status === "Pending"
).length;

const waitingForTakeover = handovers.filter(
  (handover) => handover.status === "Pending"
).length;

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const overdueProjects = projects.filter((project) => {
  if (project.status === "Completed") {
    return false;
  }

  const completionDate = new Date(project.expectedCompletion);
  completionDate.setHours(0, 0, 0, 0);

  return completionDate < todayDate;
}).length;

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
       
            <StatCard number={projects.length} label="Active Projects" />
            <StatCard number={activeHandovers} label="Active Handovers" />
            <StatCard number={waitingForTakeover} label="Waiting for Takeover" />
            <StatCard  number={overdueProjects} label="Overdue" />   
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
    <div>
      <h2>Handover Activity</h2>
      <p>Recent project handovers and takeovers across the team.</p>
    </div>
  </div>

  {handovers.length === 0 ? (
    <div className="empty-state">
      <div className="empty-icon">↗</div>
      <h3>No handover activity</h3>
      <p>
        Handover activity will appear here when a project is transferred.
      </p>
    </div>
  ) : (
    <div className="handover-activity-list">
      {handovers.map((handover) => {
        const project = projects.find(
          (project) => project.id === handover.projectId
        );

        return (
          <div className="handover-activity-item" key={handover.id}>
            <div className="handover-activity-icon">
              ↗
            </div>

            <div className="handover-activity-details">
              <h3>
                {project
                  ? project.projectName
                  : `Project #${handover.projectId}`}
              </h3>

              <p>
                <strong>{handover.fromUser}</strong>
                {" handed over this project to "}
                <strong>{handover.toUser}</strong>
              </p>

              <span className="handover-status">
                {handover.status}
              </span>
            </div>
          </div>
              );
            })}
          </div>
        )}
          </section>
        </main>
      </div>
    </div>
  );
}
export default Dashboard;
