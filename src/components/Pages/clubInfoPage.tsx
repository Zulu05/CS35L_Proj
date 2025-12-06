// External Dependencies
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Internal Dependencies
// Models
import Club from "../../models/clubs";
import { TRAITS } from "../../models/traits";

// Services
import { fetchSingleUser } from "../../services/users.service";
import { fetchClubs } from "../../services/club.service";

// Frontend
import '../css/clubInformation.css';

// Type Definitions
type MatchMap = Record<string, number>;
type FilterMap = Record<string, number>;

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
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterMap>(() => {
    const initial: FilterMap = {};
    TRAITS.forEach(t => initial[t.id] = 0);
    return initial;
  });

  const displayedClubs = useMemo(() => {
    // 1. Sort by Match Score (Descending)
    const sorted = [...clubs].sort((a, b) => {
      const scoreA = matchMap[a.id?.toString() ?? ""] ?? -1;
      const scoreB = matchMap[b.id?.toString() ?? ""] ?? -1;
      return scoreB - scoreA;
    });

    // 2. Filter pipeline
    return sorted.filter(club => {
      // Name search
      const matchesName = club.clubname.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Attribute values
      const matchesAttributes = TRAITS.every(trait => {
        const minVal = filters[trait.id] || 0;
        if (minVal === 0) return true; // Filter ignored if 0
        
        const clubScore = club.scores.find(s => s.traitId === trait.id)?.value || 0;
        return clubScore >= minVal;
      });

      return matchesName && matchesAttributes;
    });
  }, [clubs, matchMap, searchTerm, filters]);

  const handleFilterChange = (traitId: string, value: number) => {
    setFilters(prev => ({ ...prev, [traitId]: value }));
  };

  const handleResetFilters = () => {
    const reset: FilterMap = {};
    TRAITS.forEach(t => reset[t.id] = 0);
    setFilters(reset);
  };

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

        <div className="filter-section">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          >
            {showFilters ? "Close Filters" : "Filter by Attributes"}
          </button>

          {showFilters && (
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={handleResetFilters} 
            />
          )}
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
          <EmptyState 
            searchTerm={searchTerm} 
            hasFilters={Object.values(filters).some(v => v > 0)}
            onReset={handleResetFilters}
          />
        )}
      </main>
      
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

// --- Sub-Components ---

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

interface FilterPanelProps {
  filters: FilterMap;
  onFilterChange: (id: string, val: number) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => (
  <div className="filter-panel">
    <h3>Minimum Score Requirements</h3>
    
    <div className="filter-grid">
      {TRAITS.map((trait) => (
        <div key={trait.id}>
          <label className="filter-label">
            <span>{trait.labelLeft}</span>
            <span className="value">{filters[trait.id]}+</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters[trait.id]}
            onChange={(e) => onFilterChange(trait.id, Number(e.target.value))}
            className="filter-range"
          />
        </div>
      ))}
    </div>

    <div className="filter-footer">
      <button onClick={onReset} className="reset-btn">
        Reset Filters
      </button>
    </div>
  </div>
);

const EmptyState: React.FC<{ searchTerm: string; hasFilters: boolean; onReset: () => void }> = ({ searchTerm, hasFilters, onReset }) => (
  <div className="empty-state">
    <p className="title">No clubs found.</p>
    <p>Try adjusting your search terms or lowering your filter thresholds.</p>
    {hasFilters && (
      <button onClick={onReset} className="clear-filters-btn">
        Clear all filters
      </button>
    )}
  </div>
);

export default ClubDirectory;