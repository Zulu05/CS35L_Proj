import React, { useEffect, useState } from "react";
import { fetchClubs } from "../../services/club.service";
import { fetchSingleUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import Club from "../../models/clubs";
import '../css/clubInformation.css';

const ClubDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [matchMap, setMatchMap] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");  // For search functionality

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    (async () => {
      // 1) Load all clubs
      const clubList = await fetchClubs();
      setClubs(clubList);

      // If not logged in, we can't show matches
      if (!userId) return;

      // 2) Load the current user (with latestClubMatches)
      const user = await fetchSingleUser(userId);
      if (!user || !user.latestClubMatches) return;

      // 3) Build a map: clubId -> matchPercent
      const map: Record<string, number> = {};
      (user.latestClubMatches as any[]).forEach((m) => {
        const cid =
          m.clubId?.toString?.() ??
          m.clubId ??
          m.club?.id?.toString?.();
        if (!cid) return;

        const percent =
          typeof m.matchPercent === "number"
            ? m.matchPercent
            : Math.round((m.similarity ?? 0) * 100);

        map[cid] = percent;
      });

      setMatchMap(map);
    })();
  }, []);

// Sort clubs by match percentage (highest first)
const sortedClubs = [...clubs].sort((a, b) => {
  const aId = a.id?.toString();
  const bId = b.id?.toString();

  const aMatch = aId && aId in matchMap ? matchMap[aId] : -1;
  const bMatch = bId && bId in matchMap ? matchMap[bId] : -1;

  return bMatch - aMatch; // descending order
});

// Search filter logic: creating a filtered list based on search term
const filteredClubs = sortedClubs.filter((club) =>
  club.clubname.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
    <div className="club-directory-container">
      <div className="text-center" style={{ textAlign: 'center' }}>
        <h1 className="club-header-title">
          Club Directory
        </h1>

        <p className="club-header-subtitle">
          Discover clubs on campus and find one that matches your interests.
        </p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="club-search-input"
          />
        </div>
      </div>    

      <div className="club-grid-force-2">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => {
            const clubId = club.id?.toString();
            const matchPercent =
              clubId && clubId in matchMap ? matchMap[clubId] : null;

            return (
              <div key={clubId} className="club-card">
                <h2>{club.clubname}</h2>

                {matchPercent !== null && (
                  <p className="match-score">
                    Match Score: {matchPercent}%
                  </p>
                )}

                <a
                  href={`mailto:${club.email}`}
                  className="club-contact-btn"
                >
                  Contact
                </a>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "span 2", textAlign: "center", color: "var(--text-soft)", padding: "2rem" }}>
            No clubs found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};
export default ClubDirectory;
