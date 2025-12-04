// Internal Dependencies
// Models
import { TraitDefinition } from "../models/traits";

export async function fetchTraits(): Promise<TraitDefinition[]> {
  try {
    const res = await fetch("/traits", { headers: { Accept: "application/json" } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to fetch traits: ${res.status} ${text}`);
    }
    const traits = (await res.json()) as TraitDefinition[];
    return traits;
  } catch (err) {
    console.error("Error fetching traits:", err);
    return [];
  }
}