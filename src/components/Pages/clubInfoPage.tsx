import React, { useEffect, useState } from "react";
import { fetchClubs } from "../../services/club.service";
import { fetchSingleUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import Club from "../../models/clubs";

const ClubDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [matchMap, setMatchMap] = useState<Record<string, number>>({});

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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Club Directory
        </h1>
        <p className="text-gray-600">
          Discover clubs on campus and find one that matches your interests.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => {
          const clubId = club.id?.toString();
          const matchPercent =
            clubId && clubId in matchMap ? matchMap[clubId] : null;

          return (
            <div
              key={clubId}
              className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {club.clubname}
              </h2>

              {matchPercent !== null && (
                <p className="text-sm font-normal text-gray-600 mb-2">
                  Match Score: {matchPercent}%
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${club.email}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Contact
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ClubDirectory;
