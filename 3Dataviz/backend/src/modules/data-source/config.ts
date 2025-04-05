export const WEATHER_API_CONFIG = {
  NAME: "Temperatura oraria",
  BASE_URL: `https://archive-api.open-meteo.com/v1/archive?latitude=@LATITUDE@
  &longitude=@LONGITUDE@&start_date=@START_DATE@&end_date=@END_DATE@
  &hourly=temperature_2m`,
  START_DATE: "2025-01-01",
  END_DATE: "2025-03-31",
  CITIES: [
    {
      id: 0,
      name: "Francoforte",
      latitude: 50.02,
      longitude: 8.48,
    },
    {
      id: 1,
      name: "Parigi",
      latitude: 48.54,
      longitude: 2.27,
    },
    {
      id: 2,
      name: "Rome",
      latitude: 41.93,
      longitude: 12.56,
    },
    {
      id: 3,
      name: "Londra",
      latitude: 51.49,
      longitude: -0.16,
    },
  ],
  DESCRIPTION: `Dataset contenente la temperatura media oraria per alcune 
  grandi città europee, dal 01/01/2025 al 31/03/2025.`,
  LEGEND: {
    x: "Ore",
    y: "Temperatura (°C)",
    z: "Città",
  },
};

export const POPULATION_API_CONFIG = {
  NAME: "Popolazione per anno",
  BASE_URL: `https://api.worldbank.org/v2/country/@COUNTRY_CODE@/indicator/
  SP.POP.TOTL?date=@START_YEAR@:@END_YEAR@&format=json&per_page=10000`,
  START_YEAR: 1970,
  END_YEAR: 2023,
  COUNTRIES: [
    {
      id: 0,
      name: "Italia",
      countryCode: "ITA",
    },
    {
      id: 1,
      name: "Francia",
      countryCode: "FRA",
    },
    {
      id: 2,
      name: "Germania",
      countryCode: "DEU",
    },
    {
      id: 3,
      name: "Spagna",
      countryCode: "ESP",
    },
    {
      id: 4,
      name: "Regno Unito",
      countryCode: "GBR",
    },
    {
      id: 5,
      name: "Polonia",
      countryCode: "POL",
    },
    {
      id: 6,
      name: "Romania",
      countryCode: "ROU",
    },
    {
      id: 7,
      name: "Paesi Bassi",
      countryCode: "NLD",
    },
    {
      id: 8,
      name: "Belgio",
      countryCode: "BEL",
    },
    {
      id: 9,
      name: "Grecia",
      countryCode: "GRC",
    },
    {
      id: 10,
      name: "Portogallo",
      countryCode: "PRT",
    },
    {
      id: 11,
      name: "Russia",
      countryCode: "RUS",
    },
    {
      id: 12,
      name: "Australia",
      countryCode: "AUS",
    },
    {
      id: 13,
      name: "Austria",
      countryCode: "AUT",
    },
    {
      id: 14,
      name: "Norvegia",
      countryCode: "NOR",
    },
    {
      id: 15,
      name: "Svezia",
      countryCode: "SWE",
    },
    {
      id: 16,
      name: "Stati Uniti",
      countryCode: "USA",
    },
    {
      id: 17,
      name: "Irlanda",
      countryCode: "IRL",
    },
    {
      id: 18,
      name: "Islanda",
      countryCode: "ISL",
    },
    {
      id: 19,
      name: "Turchia",
      countryCode: "TUR",
    },
    {
      id: 20,
      name: "Cina",
      countryCode: "CHN",
    },
    {
      id: 21,
      name: "Giappone",
      countryCode: "JPN",
    },
    {
      id: 22,
      name: "Singapore",
      countryCode: "SGP",
    },
    {
      id: 23,
      name: "India",
      countryCode: "IND",
    },
    {
      id: 24,
      name: "Corea del Sud",
      countryCode: "KOR",
    },
    {
      id: 25,
      name: "Canada",
      countryCode: "CAN",
    },
  ],
  DESCRIPTION: `Dataset contenente la popolazione totale di alcuni paesi 
  dal 1970 al 2023.`,
  LEGEND: {
    x: "Anno",
    y: "Popolazione (milioni)",
    z: "Paese",
  },
};

export const FLIGHTS_API_CONFIG = {
  NAME: "Partenze aeree",
  BASE_URL: `https://opensky-network.org/api/flights/departure?airport=
  @AIRPORT@START_DATETIME@&end=@END_DATETIME@`,
  // 2 aprile 2024 00:00:00
  START_DATETIME: 1712016000,
  NUM_INTERVALS: 24,
  AIRPORTS: [
    {
      id: 0,
      name: "Tokyo",
      airportCode: "RJTT",
    },
    {
      id: 1,
      name: "Pechino",
      airportCode: "ZBAA",
    },
    {
      id: 2,
      name: "Shanghai",
      airportCode: "ZSPD",
    },
    {
      id: 3,
      name: "Dammam",
      airportCode: "OEDF",
    },
    {
      id: 4,
      name: "Dubai",
      airportCode: "OMDB",
    },
    {
      id: 5,
      name: "Istanbul",
      airportCode: "LTFM",
    },
    {
      id: 6,
      name: "Mosca",
      airportCode: "UUEE",
    },
    {
      id: 7,
      name: "El Cairo",
      airportCode: "HECA",
    },
    {
      id: 8,
      name: "Francoforte",
      airportCode: "EDDF",
    },
    {
      id: 9,
      name: "Madrid",
      airportCode: "LEMD",
    },
    {
      id: 10,
      name: "Milano",
      airportCode: "LIMC",
    },
    {
      id: 11,
      name: "Parigi",
      airportCode: "LFPG",
    },
    {
      id: 12,
      name: "Lisbona",
      airportCode: "LPPT",
    },
    {
      id: 13,
      name: "Londra",
      airportCode: "EGLL",
    },
    {
      id: 14,
      name: "Buenos Aires",
      airportCode: "SABE",
    },
    {
      id: 15,
      name: "Rio de Janeiro",
      airportCode: "SBGL",
    },
    {
      id: 16,
      name: "Atlanta",
      airportCode: "KATL",
    },
    {
      id: 17,
      name: "New York",
      airportCode: "KJFK",
    },
    {
      id: 18,
      name: "Chicago",
      airportCode: "KORD",
    },
    {
      id: 19,
      name: "Dallas",
      airportCode: "KDFW",
    },
    {
      id: 20,
      name: "Denver",
      airportCode: "KDEN",
    },
    {
      id: 21,
      name: "Los Angeles",
      airportCode: "KLAX",
    },
    {
      id: 22,
      name: "Sydney",
      airportCode: "YSSY",
    },
  ],
  DESCRIPTION: `Dataset contenente il numero di partenze aeree da alcuni
  aeroporti internazionali nelle diverse fasce orarie in una giornata.`,
  LEGEND: {
    x: "Fascia oraria",
    y: "Numero di partenze",
    z: "Aeroporto",
  },
};

export const CURRENCY_API_CONFIG = {
  NAME: "Tassi di cambio",
  BASE_URL: `https://api.currencybeacon.com/v1/historical?api_key=@API_KEY@
  &base=EUR&date=@YEAR@-01-01`,
  START_YEAR: 2005,
  END_YEAR: 2025,
  NUM_CURRENCIES: 200,
  DESCRIPTION: `Dataset contenente i tassi di cambio rispetto all'Euro, 
  campionati all'inizio di ogni anno dal 2005 al 2025. Il numero di valute
  disponibili è approssimato.`,
  LEGEND: {
    x: "Anno",
    y: "Tasso",
    z: "Valuta",
  },
};
