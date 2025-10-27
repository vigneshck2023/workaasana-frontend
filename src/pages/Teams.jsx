import React, { useEffect, useState } from "react";
import axios from "axios";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("https://workaasana.vercel.app/teams");
        setTeams(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to fetch teams");
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="teams-page p-8">
      <div className="header">
        <h2>Teams</h2>
        <button className="new-btn">+ New Team</button>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="card-grid">
          {teams.map((team) => (
            <div key={team._id} className="card">
              <h4>{team.name || "Unnamed Team"}</h4>
              <div className="members">
                {team.members &&
                  team.members.slice(0, 4).map((member, index) => (
                    <div key={index} className="avatar" title={member.name}>
                      {member.initials ||
                        member.name?.[0]?.toUpperCase() ||
                        "?"}
                    </div>
                  ))}
                {team.members && team.members.length > 4 && (
                  <div className="avatar more">
                    +{team.members.length - 4}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
