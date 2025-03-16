import { City, Country, Info } from "@schemas/game";
import mongoose from "mongoose";

interface InfoData {
  country: string;
  city: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

interface CountryDocument extends Document {
  name: string;
  cities: mongoose.Types.ObjectId[];
}

interface CityDocument extends Document {
  name: string;
  country: mongoose.Types.ObjectId;
  info?: mongoose.Types.ObjectId;
}

interface InfoDocument extends Document {
  clues: string[];
  fun_fact: string[];
  trivia: string[];
  country: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
}

interface InfoResult {
  country: CountryDocument;
  city: CityDocument;
  info: InfoDocument;
}

export default class AdminDB {
  public static async addInfo(data: InfoData)
   {
    try {
      // Validate input more thoroughly
      const { country, city, clues, fun_fact, trivia } = data;

      if (!country || typeof country !== "string" || country.trim() === "") {
        console.error("Invalid country provided");
        return null;
      }

      if (!city || typeof city !== "string" || city.trim() === "") {
        console.error("Invalid city provided");
        return null;
      }

      if (!Array.isArray(clues) || clues.length === 0) {
        console.error("Invalid clues provided");
        return null;
      }

      if (!Array.isArray(fun_fact) || fun_fact.length === 0) {
        console.error("Invalid fun facts provided");
        return null;
      }

      if (!Array.isArray(trivia) || trivia.length === 0) {
        console.error("Invalid trivia provided");
        return null;
      }

      // Start a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find or create country
        let countryExists = await Country.findOne({ name: country }).session(
          session
        );
        if (!countryExists) {
          countryExists = new Country({ name: country });
          await countryExists.save({ session });
        }

        // Check for existing city
        const existingCity = await City.findOne({
          name: city,
          country: countryExists._id,
        }).session(session);

        if (existingCity) {
          console.log(`City ${city} already exists in ${country}`);
          await session.abortTransaction();
          session.endSession();
          return null;
        }

        // Create new city
        const newCity = new City({
          name: city,
          country: countryExists._id,
        });
        await newCity.save({ session });

        // Create info
        const info = new Info({
          clues,
          fun_fact,
          trivia,
          country: countryExists._id,
          city: newCity._id,
        });
        await info.save({ session });

        // Update relationships
        newCity.info = info._id;
        await newCity.save({ session });

        countryExists.cities.push(newCity._id);
        await countryExists.save({ session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Return created entities instead of input data
        return {
          country: countryExists,
          city: newCity,
          info: info,
        };
      } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      console.error("Error in addInfo:", error);
      return null;
    }
  }
}
