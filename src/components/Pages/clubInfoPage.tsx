import React, { useEffect, useMemo, useState } from "react";
import { fetchClubs } from "../../services/club.service";
import { fetchSingleUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import Club from "../../models/clubs";
import '../css/clubInformation.css';

// Type Definitions
type MatchMap = Record<string, number>;

// Helper:
// Transforms raw user match data into a quick lookup map (ClubID -> Percentage)
// Isolated for testability and readability.
function extractMatchMap(user: any): MatchMap {
  if (!user?.latestClubMatches || !Array.isArray(user.latestClubMatches)) {
    return {};
  }

  const map: MatchMap = {};
  
  user.latestClubMatches.forEach((match: any) => {
    // Normalizing club ID access 
    const clubId = match.clubId?.toString() 
                ?? match.club?.id?.toString();
    
    if (!clubId) return;

    // Normalizing percentage vs similarity decimal (backward compatibility)
    const score = typeof match.matchPercent === "number"
      ? match.matchPercent
      : Math.round((match.similarity ?? 0) * 100);

    map[clubId] = score;
  });

  return map;
}

// Hook: data fetching for returning raw data needed for view
function useClubData() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [matchMap, setMatchMap] = useState<MatchMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        
        const [clubList, user] = await Promise.all([
          fetchClubs(),
          userId ? fetchSingleUser(userId) : Promise.resolve(null)
        ]);

        setClubs(clubList);
        setMatchMap(extractMatchMap(user));
      } catch (error) {
        console.error("Failed to load directory data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { clubs, matchMap, loading };
}

// Main component
const ClubDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { clubs, matchMap } = useClubData();
  const [searchTerm, setSearchTerm] = useState("");

  const displayedClubs = useMemo(() => {
    // 1. Sort by Match Score (Descending)
    const sorted = [...clubs].sort((a, b) => {
      const scoreA = matchMap[a.id?.toString() ?? ""] ?? -1;
      const scoreB = matchMap[b.id?.toString() ?? ""] ?? -1;
      return scoreB - scoreA;
    });

    // 2. Filter by Search Term
    if (!searchTerm) return sorted;
    
    return sorted.filter(c => 
      c.clubname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, matchMap, searchTerm]);

  return (
    <div className="club-directory-container">
      <header className="text-center">
        <h1 className="club-header-title">Club Directory</h1>
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
            aria-label="Search clubs"
          />
        </div>
      </header>

      <main className="club-grid-force-2">
        {displayedClubs.length > 0 ? (
          displayedClubs.map((club) => (
            <ClubCard 
              key={club.id?.toString()} 
              club={club} 
              matchScore={matchMap[club.id?.toString() ?? ""]} 
            />
          ))
        ) : (
            <div style={{ gridColumn: "span 2", textAlign: "center", color: "var(--text-soft)", padding: "2rem" }}>
              No clubs found matching "{searchTerm}"
            </div>
        )}
      </main>
      
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

// Sub-Component for individual club cards

const ClubCard: React.FC<{ club: Club; matchScore?: number }> = ({ club, matchScore }) => (
  <div className="club-card">
    <h2>{club.clubname}</h2>
    {matchScore !== undefined && (
      <p className="match-score">Match Score: {matchScore}%</p>
    )}
    <a href={`mailto:${club.email}`} className="club-contact-btn">
      Contact
    </a>
  </div>
);

export default ClubDirectory;