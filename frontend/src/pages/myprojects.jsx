import { useEffect, useState } from "react";
import "./myprojects.css";
import Sidebar from "../components/Sidebar";

function MyProjects({ currentPage, setCurrentPage, user, onLogout, }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    expectedCompletion: "",
    priority: "Medium",
    progress: 0,
  });


 useEffect(() => {
  console.log("Logged-in user:", user);
  console.log("Display name:", user?.displayName);

  if (!user?.displayName) {
    return;
  }

  const url = `http://localhost:5134/api/projects/owner/${encodeURIComponent(
    user.displayName
  )}`;

  console.log("Projects URL:", url);

  fetch(url)
    .then((response) => {
      console.log("Response status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("My projects:", data);
      setProjects(data);
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
    });
}, [user]);

const loadTeamMembers = async () => {
  try {
    const response = await fetch("http://localhost:5134/api/users");

    if (!response.ok) {
      throw new Error("Failed to load team members");
    }

    const data = await response.json();

    setTeamMembers(data);
  } catch (error) {
    console.error("Error loading team members:", error);
  }
};

const handleHandoverClick = async (project) => {
  setSelectedProject(project);
  setSelectedTeamMember("");

  await loadTeamMembers();

  setShowHandoverForm(true);
};
const handleSendHandover = async (event) => {
  event.preventDefault();

  if (!selectedTeamMember) {
    alert("Please select a team member.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5134/api/handovers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: selectedProject.id,
        fromUser: user.displayName,
        toUser: selectedTeamMember,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create handover");
    }

    alert("Handover sent successfully.");

    setShowHandoverForm(false);
    setSelectedProject(null);
    setSelectedTeamMember("");
  } catch (error) {
    console.error("Error sending handover:", error);
    alert(error.message);
  }
};



  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5134/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: formData.projectName,
          description: formData.description,
          startDate: formData.startDate,
          expectedCompletion: formData.expectedCompletion,
          priority: formData.priority,
          progress: Number(formData.progress),
          status: "In Progress",
          owner: user?.displayName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();

      setProjects([...projects, newProject]);

      setFormData({
        projectName: "",
        description: "",
        startDate: "",
        expectedCompletion: "",
        priority: "Medium",
        progress: 0,
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
    const handleUpdateProgress = async (projectId, currentProgress) => {
  const newProgress = window.prompt(
    "Enter new progress (0-100):",
    currentProgress
  );

  if (newProgress === null) {
    return;
  }

  const progress = Number(newProgress);

  if (isNaN(progress) || progress < 0 || progress > 100) {
    alert("Please enter a number between 0 and 100.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5134/api/projects/${projectId}/progress`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progress: progress,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update progress");
    }

    const updatedProject = await response.json();

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  } catch (error) {
    console.error("Error updating progress:", error);
    alert("Could not update project progress.");
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
      <div className="my-projects-page">

      <div className="projects-header">
        <div>
          <h1>My Projects</h1>
          <p>Projects you own and manage.</p>
        </div>

        <button
          className="create-project-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Project
        </button>
      </div>

  {showHandoverForm && selectedProject && (
  <div className="project-form-container">

    <h2>Handover Project</h2>

    <p>
      Select a team member to hand over{" "}
      <strong>{selectedProject.projectName}</strong>.
    </p>

    <form onSubmit={handleSendHandover}>

      <div className="form-group">
        <label>Team Member</label>

        <select
          value={selectedTeamMember}
          onChange={(event) =>
            setSelectedTeamMember(event.target.value)
          }
          required
        >
          <option value="">Select team member</option>

          {teamMembers
            .filter(
              (member) =>
                member.displayName !== user.displayName
            )
            .map((member) => (
              <option
                key={member.id}
                value={member.displayName}
              >
                {member.displayName}
              </option>
            ))}
        </select>
      </div>

      <div className="form-buttons">

        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            setShowHandoverForm(false);
            setSelectedProject(null);
            setSelectedTeamMember("");
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-btn"
        >
          Send Handover
        </button>

      </div>

        </form>
      </div>
        )}

      {showForm && (
        <div className="project-form-container">

          <h2>Create New Project</h2>

          <form onSubmit={handleCreateProject}>

            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description."
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expected Completion</label>

                <input
                  type="date"
                  name="expectedCompletion"
                  value={formData.expectedCompletion}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Priority</label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Initial Progress (%)</label>

                <input
                  type="number"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-buttons">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                Create Project
              </button>

            </div>

          </form>
        </div>
      )}

    

      <div className="projects-section">

        <div className="section-heading">
          <h2>Your Projects</h2>
          <span>{projects.length} project(s)</span>
        </div>

        {projects.length === 0 ? (

          <div className="empty-projects">

            <div className="empty-icon">📁</div>

            <h3>No projects yet</h3>

            <p>
              Create your first project to start managing your work.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="empty-create-btn"
            >
              + Create Project
            </button>

          </div>

        ) : (

          <div className="projects-grid">

            {projects.map((project) => (

              <div
                className="project-card"
                key={project.id}
              >

                <div className="project-card-header">

                  <div>
                    <h3>{project.projectName}</h3>

                    <p>
                      {project.description}
                    </p>
                  </div>

                  <span
                    className={`priority ${project.priority
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {project.priority}
                  </span>

                </div>

                <div className="progress-section">

                  <div className="progress-header">

                    <span>Progress</span>

                    <strong>
                      {project.progress}%
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    ></div>

                  </div>

                </div>

                <div className="project-details">

                  <div>
                    <span>Status</span>
                    <strong>{project.status}</strong>
                  </div>

                  <div>
                    <span>Owner</span>
                    <strong>{project.owner}</strong>
                  </div>

                  <div>
                    <span>Start</span>
                    <strong>
                      {project.startDate}
                    </strong>
                  </div>

                  <div>
                    <span>Expected Completion</span>
                    <strong>
                      {project.expectedCompletion}
                    </strong>
                  </div>

                </div>

                <div className="project-actions">

                  <button 
                  className="update-progress-btn"
                    onClick={() =>
                    handleUpdateProgress(project.id, project.progress)
                    }
                  >
                    Update Progress
                  </button>

                  <button
                   className="handover-btn"
                    onClick={() => handleHandoverClick(project)}>
                    Handover
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
    </div>
    </div>
  );
}

export default MyProjects;