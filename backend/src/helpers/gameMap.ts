export default class GameHashmap {
  private static instance: GameHashmap;
  private map: Map<string, string[]>;

  private constructor() {
    this.map = new Map();
  }

  private static getCityCountryOptions(
    data: any[],
    correctOption: string,
    count: number = 3
  ): string[] {
    if (data.length <= count) {
      return data.map((item) => {
        const cityName = item.city.name || item.city;
        const countryName = item.country.name || item.country;
        return `${cityName}, ${countryName}`;
      });
    }

    const dataCopy = [...data];
    const cityCountryOptions: string[] = [];
    const usedIndices = new Set<number>();

    while (
      cityCountryOptions.length < count &&
      usedIndices.size < dataCopy.length
    ) {
      const randomIndex = Math.floor(Math.random() * dataCopy.length);

      if (usedIndices.has(randomIndex)) continue;
      usedIndices.add(randomIndex);

      const randomItem = dataCopy[randomIndex];
      const cityName = randomItem.city.name || randomItem.city;
      const countryName = randomItem.country.name || randomItem.country;
      const cityCountryOption = `${cityName}, ${countryName}`;

      if (
        cityCountryOption === correctOption ||
        cityCountryOptions.includes(cityCountryOption)
      ) {
        continue;
      }

      cityCountryOptions.push(cityCountryOption);
    }

    return cityCountryOptions;
  }

  public static getInstance(): GameHashmap {
    if (!GameHashmap.instance) {
      GameHashmap.instance = new GameHashmap();
    }
    return GameHashmap.instance;
  }

  public getMap(): Map<string, string[]> {
    return this.map;
  }

  public setPlayed(key: string, value: string): void {
    if (this.map.has(key)) {
      const existingValues = this.map.get(key) || [];

      if (!existingValues.includes(value)) {
        existingValues.push(value);
        this.map.set(key, existingValues);
      }
    } else {
      this.map.set(key, [value]);
    }
  }

  public getPlayed(key: string): string[] | undefined {
    return this.map.get(key);
  }

  public deletePlayed(key: string) {
    return this.map.delete(key);
  }
  public getRandomClue(data: any[]) {
    if (!data || data.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomData = data[randomIndex];

    const city = randomData.city.name || randomData.city;
    const country = randomData.country.name || randomData.country;
    const randomClue = randomData.clues;

    const correctOption = `${city}, ${country}`;
    const options = [correctOption];

    const cityCountryOptions = GameHashmap.getCityCountryOptions(
      data.filter((item) => item._id !== randomData._id),
      correctOption,
      3
    );

    const allOptions = [...options, ...cityCountryOptions];
    this.shuffleArray(allOptions);

    return {
      randomClue,
      clueId: randomData._id,
      options: allOptions,
    };
  }
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
