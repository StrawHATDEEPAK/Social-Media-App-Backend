import mongoose from "mongoose";
import { UserDoc } from "./User";

interface StampAttrs {
  stampUrl: string;
  op: string;
  blockIndex: number;
  creator: string;
  amt: number;
  txHash: string;
  txIndex: number;
  tick: string;
  stamp: string;
  p: string;
  owner: UserDoc;
  likes?: UserDoc[];
}

interface StampModel extends mongoose.Model<StampDoc> {
  build(attrs: StampAttrs): StampDoc;
}

export interface StampDoc extends mongoose.Document {
  stampUrl: string;
  op: string;
  blockIndex: number;
  creator: string;
  amt: number;
  txHash: string;
  txIndex: number;
  tick: string;
  stamp: string;
  p: string;
  owner: UserDoc;
  likes?: UserDoc[];
}

const StampSchema = new mongoose.Schema(
  {
    stampUrl: {
      type: String,
      required: true,
    },
    op: {
      type: String,
      required: true,
    },
    blockIndex: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    amt: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    txIndex: {
      type: Number,
      required: true,
    },
    tick: {
      type: String,
      required: true,
    },
    stamp: {
      type: String,
      required: true,
    },
    p: {
      type: String,
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

StampSchema.set("timestamps", true);
StampSchema.statics.build = (attrs: StampAttrs) => {
  return new Stamp(attrs);
};

const Stamp = mongoose.model<StampDoc, StampModel>("Stamp", StampSchema);

export { Stamp, StampSchema };
