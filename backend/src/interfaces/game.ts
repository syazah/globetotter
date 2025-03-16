export interface CountryType {
  name: string;
  cities?: CityType[];
}
export interface CityType {
  name: string;
  country: CountryType;
  info: InfoType;
}
export interface InfoType {
  clues: string[];
  funFact: string[];
  trivia: string[];
  country: CountryType;
  city: CityType;
}
