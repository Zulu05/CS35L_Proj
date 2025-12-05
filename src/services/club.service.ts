// src/services/club.service.ts

// Internal Dependencies
// Models
import Club, { TraitScore } from '../models/clubs';

const DEFAULT_TRAITS = ['social', 'academic', 'leadership', 'creativity'];

function normalizeScores(raw: any): TraitScore[] {
  if (Array.isArray(raw)) {
    return raw.map((s) => ({
      traitId: String(s.traitId),
      value: Number(s.value ?? 50),
    }));
  }

  // Old object format for backwards compatibility
  if (raw && typeof raw === 'object') {
    return Object.keys(raw).map((key) => ({
      traitId: key,
      value: Number((raw as any)[key] ?? 50),
    }));
  }

  // use defaults if empty
  return DEFAULT_TRAITS.map((id) => ({ traitId: id, value: 50 }));
}

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
          normalizeScores(c.scores),
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
  // allow both new array format and old object format for callers
  scores?: TraitScore[] | { [key: string]: number };
}): Promise<Club> {
  const finalName = club.clubname ?? club.username ?? '';
  const email = club.email ?? '';

  const normalizedScores = normalizeScores(club.scores);

  const body = {
    clubname: finalName,
    username: finalName,
    email,
    scores: normalizedScores,
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

  const raw = await res.text().catch(() => '');
  let created: any = {};
  try {
    created = raw ? JSON.parse(raw) : {};
  } catch {
    console.error('Non-JSON response from /clubs:', raw);
  }

  const nameFromDb = created.clubname ?? created.username ?? finalName;
  const emailFromDb = created.email ?? email;
  const scoresFromDb = normalizeScores(created.scores ?? normalizedScores);
  const idFromDb = created._id || created.id;

  return new Club(nameFromDb, emailFromDb, scoresFromDb, idFromDb);
}

export async function changeScores(
  clubId: string,
  scores: TraitScore[] | { [key: string]: number }
): Promise<Club> {
  const normalizedScores = normalizeScores(scores);

  const res = await fetch(`/clubs/${clubId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scores: normalizedScores }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Failed to update club scores: ${res.status} ${res.statusText} ${text}`
    );
  }

  const raw = await res.text().catch(() => '');
  let updatedData: any = {};
  try {
    updatedData = raw ? JSON.parse(raw) : {};
  } catch {
    console.error('Non-JSON response from PUT /clubs/:id:', raw);
  }

  const nameFromDb = updatedData.clubname ?? updatedData.username ?? '';
  const emailFromDb = updatedData.email ?? '';
  const scoresFromDb = normalizeScores(
    updatedData.scores ?? normalizedScores
  );
  const idFromDb = updatedData._id || updatedData.id || clubId;

  return new Club(nameFromDb, emailFromDb, scoresFromDb, idFromDb);
}