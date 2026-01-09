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
      type: String,
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
    tagId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      required: false,
    },
    tagActivatedAt: {
      type: Date,
      required: false,
    },
    isPublicProfile: {
      type: Boolean,
      default: false,
    },
    isLost: {
      type: Boolean,
      default: false,
    },
    lostAt: {
      type: Date,
      required: false,
    },
    lostLocation: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

type PetType = InferSchemaType<typeof petSchema>;

const Pet = model<PetType>("Pet", petSchema);

export default Pet;
