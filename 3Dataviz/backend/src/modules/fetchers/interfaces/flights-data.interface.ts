export interface FlightsRecord {
  firstSeen: number;
}

export interface FlightsData {
  [airportCode: string]: FlightsRecord[];
}
