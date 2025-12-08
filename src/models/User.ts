import { required } from "joi";
import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    pets: {
      type: [Schema.Types.ObjectId],
      ref: "Pet",
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>("User", userSchema);

export default User;
