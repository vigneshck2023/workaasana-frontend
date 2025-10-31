import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Teams.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", members: ["", "", ""] });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newMember, setNewMember] = useState("");

  // Fetch teams on load
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("https://workaasana.vercel.app/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to fetch teams.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Create new team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return alert("Team name cannot be empty!");

    const members = newTeam.members
      .filter((m) => m.trim() !== "")
      .map((m) => ({ name: m }));

    try {
      const res = await axios.post("https://workaasana.vercel.app/teams", {
        name: newTeam.name,
        members,
      });
      setTeams([...teams, res.data]);
      setNewTeam({ name: "", members: ["", "", ""] });
      setShowModal(false);
    } catch (err) {
      console.error("Error creating team:", err);
      alert("Failed to create team");
    }
  };

  // ✅ Add new member using backend route
  const handleAddMember = async (teamId) => {
    if (!newMember.trim()) return alert("Member name cannot be empty!");

    try {
      const res = await axios.post(
        `https://workaasana.vercel.app/teams/${teamId}/members`,
        { name: newMember }
      );

      // Update teams state
      setTeams(
        teams.map((team) => (team._id === teamId ? res.data : team))
      );

      setNewMember("");
      setSelectedTeam(null);
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member");
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Teams</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-sm"
        >
          + New Team
        </button>
      </div>

      {/* Teams List */}
      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <h5 className="mb-0">{team.name}</h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setSelectedTeam(
                        selectedTeam === team._id ? null : team._id
                      )
                    }
                  >
                    + Add Member
                  </button>
                </div>

                <div className="card-body">
                  {/* Members */}
                  {team.members?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {team.members.map((member, i) => (
                        <div
                          key={i}
                          className="badge bg-primary-subtle text-primary border rounded-circle p-3 text-uppercase fw-semibold"
                          title={member.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                          }}
                        >
                          {member.name?.[0] || "?"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No members yet</p>
                  )}

                  {/* Add Member Input */}
                  {selectedTeam === team._id && (
                    <div className="d-flex align-items-center gap-2 mt-3 p-2 bg-light rounded">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter member name"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                      />
                      <button
                        className="btn btn-primary px-3"
                        onClick={() => handleAddMember(team._id)}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Team */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Team</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateTeam}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Team Name"
                      value={newTeam.name}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, name: e.target.value })
                      }
                    />
                  </div>

                  <label className="form-label">Add Members</label>
                  {newTeam.members.map((member, index) => (
                    <input
                      key={index}
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Member Name ${index + 1}`}
                      value={member}
                      onChange={(e) => {
                        const updated = [...newTeam.members];
                        updated[index] = e.target.value;
                        setNewTeam({ ...newTeam, members: updated });
                      }}
                    />
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
