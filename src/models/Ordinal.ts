import mongoose from "mongoose";
import { UserDoc } from "./User";

interface OrdinalAttrs {
  id: string;
  number: number;
  address: string;
  genesisAddress: string;
  txId: string;
  location: string;
  output: string;
  value: number;
  offset: number;
  satOrdinal: number;
  satRarity: String;
  satCoinBaseHeight: number;
  mimeType: string;
  contentLength: number;
  owner: UserDoc;
  likes?: UserDoc[];
}

interface OrdinalModel extends mongoose.Model<OrdinalDoc> {
  build(attrs: OrdinalAttrs): OrdinalDoc;
}

export interface OrdinalDoc extends mongoose.Document {
  id: string;
  number: number;
  address: string;
  genesisAddress: string;
  txId: string;
  location: string;
  output: string;
  value: number;
  offset: number;
  satOrdinal: number;
  satRarity: String;
  satCoinBaseHeight: number;
  mimeType: string;
  contentLength: number;
  owner: UserDoc;
  likes?: UserDoc[];
}

const OrdinalSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    genesisAddress: {
      type: String,
      required: true,
    },
    txId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
    satOrdinal: {
      type: Number,
      required: true,
    },
    satRarity: {
      type: String,
      required: true,
    },
    satCoinBaseHeight: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    contentLength: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

OrdinalSchema.set("timestamps", true);
OrdinalSchema.statics.build = (attrs: OrdinalAttrs) => {
  return new Ordinal(attrs);
};

const Ordinal = mongoose.model<OrdinalDoc, OrdinalModel>(
  "Ordinal",
  OrdinalSchema
);

export { Ordinal, OrdinalSchema };
