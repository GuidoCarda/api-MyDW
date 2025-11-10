import { InferSchemaType, model, Schema } from "mongoose";

const tagSchema = new Schema(
  {
    tagId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: false,
    },
    activatedBy: {
      type: String,
      ref: "User",
      required: false,
    },
    activatedAt: {
      type: Date,
      required: false,
    },
    batchNumber: {
      type: String,
      required: false,
    },
    qrUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type TagType = InferSchemaType<typeof tagSchema>;

const Tag = model<TagType>("Tag", tagSchema);

export default Tag;
