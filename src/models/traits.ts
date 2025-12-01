
// Example
export interface TraitDefinition {
  id: string;              // "social"
  labelLeft: string;       // "social"
  labelRight: string;      // "reclusive"
  questionText: string;    // "Use the slider to indicate where you fall on this spectrum:"
}

export interface TraitScore {
  traitId: string;         // matches TraitDefinition.id
  value: number;           // 0-100
}

export const TRAITS: TraitDefinition[] = [
  {
    id: "social",
    labelLeft: "social",
    labelRight: "reclusive",
    questionText: "Use the slider to indicate where you fall on this spectrum:",
  },
  {
    id: "academic",
    labelLeft: "academic",
    labelRight: "laid-back",
    questionText: "Use the slider to indicate where you fall on this spectrum:",
  },
  {
    id: "leadership",
    labelLeft: "leader",
    labelRight: "supporter",
    questionText: "Use the slider to indicate where you fall on this spectrum:",
  },
  {
    id: "creativity",
    labelLeft: "creative",
    labelRight: "practical",
    questionText: "Use the slider to indicate where you fall on this spectrum:",
  },
];