import mongoose from "mongoose";
import { City, Country, Info } from "@schemas/game";
import { CountryType } from "@interfaces/game";

export default class GameDB {
  public static async getCountries() {
    const countries = await Country.find();
    if (!countries) {
      return null;
    }
    return countries;
  }

  public static async getCities(country: string) {
    const countryData = await Country.findOne({ name: country }).populate(
      "cities"
    );
    if (!countryData) {
      return null;
    }
    return countryData.cities;
  }

  public static async getInfo() {
    const info = await Info.find().populate("country").populate("city");
    if (!info) {
      return null;
    }
    return info;
  }

  public static async getInfoById(id: string) {
    const info: any = await Info.findById(id)
      .populate("country")
      .populate("city");
    const destinationData = {
      country: info.country?.name,
      city: info.city?.name,
      fun_fact: info.fun_fact,
      trivia: info.trivia,
      clues: info.clues,
    };
    if (!info) {
      return null;
    }
    return destinationData;
  }
}
