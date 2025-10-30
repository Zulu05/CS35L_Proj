import React from "react";
import { useNavigate } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  description: string;
  meetingTime: string;
  location: string;
  contactEmail: string;
  website?: string;
}

const clubs: Club[] = [
  {
    id: 1,
    name: "Programming Club",
    description:
      "A community for students interested in coding, algorithms, and open-source projects.",
    meetingTime: "Thursdays, 6 PM",
    location: "Engineering IV, Room 102",
    contactEmail: "programming@school.edu",
    website: "https://programmingclub.com",
  },
  {
    id: 2,
    name: "Robotics Club",
    description:
      "Build robots, compete in challenges, and learn hardware and software integration.",
    meetingTime: "Tuesdays, 7 PM",
    location: "Tech Hall, Room 210",
    contactEmail: "robotics@school.edu",
    website: "https://roboticsclub.com",
  },
  {
    id: 3,
    name: "Design Club",
    description:
      "Explore creativity through UI/UX, product design, and digital art workshops.",
    meetingTime: "Wednesdays, 5 PM",
    location: "Arts Building, Room 12",
    contactEmail: "design@school.edu",
    website: "https://designclub.com",
  },
];

const ClubDirectory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Club Directory</h1>
        <p className="text-gray-600">
          Discover clubs on campus and find one that matches your interests.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {club.name}
            </h2>
            <p className="text-gray-600 mb-4">{club.description}</p>

            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <p>
                <strong>Meeting:</strong> {club.meetingTime}
              </p>
              <p>
                <strong>Location:</strong> {club.location}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${club.contactEmail}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Contact
              </a>
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default ClubDirectory;
