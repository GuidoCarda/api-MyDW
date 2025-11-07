import { InferSchemaType, model, Schema } from "mongoose";

const petSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    isCastrated: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    photos: {
      type: [String],
      required: false,
    },
    medicalInformation: {
      type: String,
      required: false,
    },
    temperament: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

type PetType = InferSchemaType<typeof petSchema>;

const Pet = model<PetType>("Pet", petSchema);

export default Pet;
