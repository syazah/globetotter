import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    cities: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "City",
    },
  },
  {
    timestamps: true,
  }
);

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

      lowercase: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Info",
    },
  },
  {
    timestamps: true,
  }
);
CitySchema.index({ name: 1, country: 1 }, { unique: true });

const InfoSchema = new mongoose.Schema(
  {
    clues: {
      type: [String],
      required: true,
    },
    fun_fact: {
      type: [String],
      required: true,
    },
    trivia: {
      type: [String],
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
  },
  {
    timestamps: true,
  }
);

export const Country = mongoose.model("Country", CountrySchema);
export const City = mongoose.model("City", CitySchema);
export const Info = mongoose.model("Info", InfoSchema);
