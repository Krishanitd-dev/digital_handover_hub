import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./handovers.css";

function Handovers({
  currentPage,
  setCurrentPage,
  user,
  onLogout,
}) {
  const [handovers, setHandovers] = useState([]);

  useEffect(() => {
    if (!user?.displayName) {
      return;
    }

    fetch(
      `http://localhost:5134/api/handovers/from/${encodeURIComponent(
        user.displayName
      )}`
    )
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
  }, [user]);

  return (
    <div className="dashboard-layout">

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      <div className="dashboard-main">

        <div className="handovers-page">

          <div className="projects-header">
            <div>
              <h1>Handovers</h1>
              <p>Projects you have sent to other team members.</p>
            </div>
          </div>

          {handovers.length === 0 ? (
            <div className="empty-projects">
              <div className="empty-icon">↗</div>

              <h3>No handovers yet</h3>

              <p>
                Projects you hand over to team members will appear here.
              </p>
            </div>
          ) : (
            <div className="projects-grid">

              {handovers.map((handover) => (
                <div
                  className="project-card"
                  key={handover.id}
                >

                  <h3>Project #{handover.projectId}</h3>

                  <div className="project-details">

                    <div>
                      <span>From</span>
                      <strong>{handover.fromUser}</strong>
                    </div>

                    <div>
                      <span>To</span>
                      <strong>{handover.toUser}</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>{handover.status}</strong>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Handovers;