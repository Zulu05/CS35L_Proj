// src/services/club.service.ts

import Club from '../models/clubs';

export async function fetchClubs(): Promise<Club[]> {
  try {
    const res = await fetch('/clubs');
    const data = await res.json();

    let rawClubData: any[] = [];
    if (Array.isArray(data)) {
      rawClubData = data;
    } else if (data && Array.isArray(data.clubs)) {
      rawClubData = data.clubs;
    } else {
      return [];
    }

    return rawClubData.map(
      (c) =>
        new Club(
          c.clubname ?? '',
          c.email ?? '',
          c.scores ?? {
            social: 0,
            academic: 0,
            leadership: 0,
            creativity: 0,
          },
          c._id || c.id
        )
    );
  } catch (err) {
    console.error('Error fetching clubs:', err);
    return [];
  }
}

export async function createClub(club: {
  clubname?: string;
  username?: string;
  email?: string;
  scores?: {
    social: number;
    academic: number;
    leadership: number;
    creativity: number;
  };
}): Promise<Club> {
  const finalName = club.clubname ?? club.username ?? '';
  const email = club.email ?? '';

  const scores =
    club.scores ?? {
      social: 50,
      academic: 50,
      leadership: 50,
      creativity: 50,
    };

  const body = {
    clubname: finalName,
    username: finalName, 
    email,
    scores,
  };

  const res = await fetch('/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    
    const text = await res.text().catch(() => '');
    throw new Error(
      `Failed to create club: ${res.status} ${res.statusText} ${text}`
    );
  }

  const contentType = res.headers.get('content-type') || '';
  let created: any = {};
  if (contentType.includes('application/json')) {
    created = await res.json();
  } else {
    const text = await res.text().catch(() => '');
    console.log('Non-JSON response from /clubs:', text);
  }

  const nameFromDb = created.clubname ?? created.username ?? finalName;
  const emailFromDb = created.email ?? email;
  const scoresFromDb = created.scores ?? scores;
  const idFromDb = created._id || created.id;

  return new Club(nameFromDb, emailFromDb, scoresFromDb, idFromDb);
}

export async function changeScores(clubId: string, scores: {
  social: number;
  academic: number;
  leadership: number;
  creativity: number; 
}): Promise<Club> {
  const res = await fetch(`/clubs/${clubId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scores }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Failed to update club scores: ${res.status} ${res.statusText} ${text}`
    );
  }

  const updatedData = await res.json();

  const nameFromDb = updatedData.clubname ?? updatedData.username ?? '';
  const emailFromDb = updatedData.email ?? '';
  const scoresFromDb = updatedData.scores ?? scores;
  const idFromDb = updatedData._id || updatedData.id || clubId;

  return new Club(nameFromDb, emailFromDb, scoresFromDb, idFromDb);
}