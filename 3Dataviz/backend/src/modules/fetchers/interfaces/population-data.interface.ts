interface PopulationRecord {
  countryiso3code: string;
  date: string;
  value: number;
}

export type PopulationData = PopulationRecord[];
