import React, { useEffect, useState } from "react";
import axios from "axios";
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

    // Clean up empty member names
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

  // Add new member to existing team
  const handleAddMember = async (teamId) => {
    if (!newMember.trim()) return alert("Member name cannot be empty!");

    try {
      const teamToUpdate = teams.find((t) => t._id === teamId);
      const updatedMembers = [...(teamToUpdate.members || []), { name: newMember }];

      const res = await axios.put(`https://workaasana.vercel.app/teams/${teamId}`, {
        members: updatedMembers,
      });

      setTeams(
        teams.map((team) =>
          team._id === teamId ? { ...team, members: updatedMembers } : team
        )
      );

      setNewMember("");
      setSelectedTeam(null);
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member");
    }
  };

  return (
    <div className="teams-page">
      {/* Header */}
      <div className="header">
        <h2>Teams</h2>
        <button onClick={() => setShowModal(true)} className="new-btn">
          + New Team
        </button>
      </div>

      {/* Teams List */}
      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="card-grid">
          {teams.map((team) => (
            <div key={team._id} className="card">
              <div className="card-header">
                <h4>{team.name}</h4>
                <button
                  className="add-member-btn"
                  onClick={() =>
                    setSelectedTeam(selectedTeam === team._id ? null : team._id)
                  }
                >
                  + Add Member
                </button>
              </div>

              {/* Members List */}
              <div className="members">
                {team.members?.length > 0 ? (
                  team.members.map((member, i) => (
                    <div key={i} className="avatar" title={member.name}>
                      {member.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  ))
                ) : (
                  <p className="no-members">No members yet</p>
                )}
              </div>

              {/* Add Member Input */}
              {selectedTeam === team._id && (
                <div className="add-member-input">
                  <input
                    type="text"
                    placeholder="Enter member name"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                  />
                  <button onClick={() => handleAddMember(team._id)}>Add</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Team */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <label>Team Name</label>
              <input
                type="text"
                placeholder="Enter Team Name"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
              />

              <label>Add Members</label>
              {newTeam.members.map((member, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Member Name ${index + 1}`}
                  value={member}
                  onChange={(e) => {
                    const updated = [...newTeam.members];
                    updated[index] = e.target.value;
                    setNewTeam({ ...newTeam, members: updated });
                  }}
                />
              ))}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
