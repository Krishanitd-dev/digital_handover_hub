import { useEffect, useState } from "react";
import "./myprojects.css";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    expectedCompletion: "",
    priority: "Medium",
    progress: 0,
  });

  // Get projects from C# API
  useEffect(() => {
    fetch("http://localhost:5134/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
      });
  }, []);

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
          owner: "Kris Dona",
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

  return (
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

      {/* CREATE PROJECT FORM */}

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
                placeholder="Customer Portal"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Customer-facing web portal for managing customer accounts and requests."
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

      {/* PROJECT LIST */}

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

                  <button className="update-btn">
                    Update Progress
                  </button>

                  <button className="handover-btn">
                    Handover
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyProjects;