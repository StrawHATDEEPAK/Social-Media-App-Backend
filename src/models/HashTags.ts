import mongoose from "mongoose";

interface HashTagAttrs {
  content: string;
  useCounter: number;
}

interface HashTagModel extends mongoose.Model<HashTagDoc> {
  build(attrs: HashTagAttrs): HashTagDoc;
}

export interface HashTagDoc extends mongoose.Document {
  content: string;
  useCounter: number;
}

const HashTagSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    useCounter: {
      type: Number,
      default: 0,
    },
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

HashTagSchema.statics.build = (attrs: HashTagAttrs) => {
  return new HashTag(attrs);
};

const HashTag = mongoose.model<HashTagDoc, HashTagModel>(
  "HashTag",
  HashTagSchema
);

export { HashTag, HashTagSchema };
