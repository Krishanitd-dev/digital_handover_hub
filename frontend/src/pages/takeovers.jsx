import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./takeovers.css";

function Takeovers({
  currentPage,
  setCurrentPage,
  user,
  onLogout,
}) {
  const [takeovers, setTakeovers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTakeovers = async () => {
    if (!user?.displayName) {
      return;
    }

    try {
      const handoverResponse = await fetch(
        `http://localhost:5134/api/handovers/to/${encodeURIComponent(
          user.displayName
        )}`
      );

      if (!handoverResponse.ok) {
        throw new Error("Failed to load takeovers");
      }

      const handoverData = await handoverResponse.json();

      setTakeovers(handoverData);

      const projectResponse = await fetch(
        "http://localhost:5134/api/projects"
      );

      if (!projectResponse.ok) {
        throw new Error("Failed to load projects");
      }

      const projectData = await projectResponse.json();

      setProjects(projectData);
    } catch (error) {
      console.error("Error loading takeovers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTakeovers();
  }, [user]);

  const handleAcceptTakeover = async (handoverId) => {
    const confirmed = window.confirm(
      "Are you sure you want to take over this project?"
    );

    if (!confirmed) {
      return;
    }

    try {

     const response = await fetch(
         `http://localhost:5134/api/handovers/${handoverId}/accept`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                 user: user.displayName,
             }),
            }
            );

            const responseText = await response.text();

            let data = {};

            if (responseText) {
            data = JSON.parse(responseText);
                }

            if (!response.ok) {
            throw new Error(
            data.message || "Failed to accept takeover"
            );
            }



      alert("Project takeover accepted successfully.");

    
      setTakeovers((currentTakeovers) =>
        currentTakeovers.filter(
          (handover) => handover.id !== handoverId
        )
      );
    } catch (error) {
      console.error("Error accepting takeover:", error);
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      <div className="dashboard-main">
        <div className="takeovers-page">

          <div className="takeovers-header">
            <div>
              <h1>Takeovers</h1>
              <p>
                Projects waiting for you to take over.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-takeovers">
              <p>Loading takeovers...</p>
            </div>
          ) : takeovers.length === 0 ? (
            <div className="empty-takeovers">
              <div className="empty-icon">✓</div>

              <h3>No projects waiting</h3>

              <p>
                Projects handed over to you will appear here.
              </p>
            </div>
          ) : (
            <div className="takeovers-grid">

              {takeovers.map((handover) => {
                const project = projects.find(
                  (project) =>
                    project.id === handover.projectId
                );

                return (
                  <div
                    className="takeover-card"
                    key={handover.id}
                  >
                    <div className="takeover-card-header">

                      <div>
                        <h3>
                          {project
                            ? project.projectName
                            : `Project #${handover.projectId}`}
                        </h3>

                        {project && (
                          <p>
                            {project.description}
                          </p>
                        )}
                      </div>

                      <span className="takeover-status">
                        Pending
                      </span>

                    </div>

                    <div className="takeover-details">

                      <div>
                        <span>From</span>
                        <strong>
                          {handover.fromUser}
                        </strong>
                      </div>

                      <div>
                        <span>Progress</span>
                        <strong>
                          {project
                            ? `${project.progress}%`
                            : "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Priority</span>
                        <strong>
                          {project
                            ? project.priority
                            : "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Expected Completion</span>
                        <strong>
                          {project
                            ? project.expectedCompletion
                            : "—"}
                        </strong>
                      </div>

                    </div>

                    <div className="takeover-actions">

                      <button
                        className="accept-takeover-btn"
                        onClick={() =>
                          handleAcceptTakeover(
                            handover.id
                          )
                        }
                      >
                        Accept Takeover
                      </button>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Takeovers;