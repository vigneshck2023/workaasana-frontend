import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch teams from backend
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Teams</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition">
            + New Team
          </button>
        </div>

        {/* Data section */}
        {loading ? (
          <p className="text-gray-500">Loading teams...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-gray-50 hover:bg-gray-100 p-5 rounded-xl shadow-sm transition"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {team.name || "Unnamed Team"}
                </h3>

                <div className="flex -space-x-3">
                  {team.members &&
                    team.members.slice(0, 4).map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-700"
                        title={member.name}
                      >
                        {member.initials ||
                          member.name?.[0]?.toUpperCase() ||
                          "?"}
                      </div>
                    ))}

                  {team.members && team.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                      +{team.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
