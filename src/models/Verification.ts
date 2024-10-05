import mongoose from "mongoose";
import { Password } from "../services/password";

interface VerificationAttrs {
  email: string;
  code: string;
}

interface VerificationModel extends mongoose.Model<VerificationDoc> {
  build(attrs: VerificationAttrs): VerificationDoc;
}

export interface VerificationDoc extends mongoose.Document {
  email?: string;
  code?: string;
}

const VerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.code;
        delete ret.__v;
      },
    },
  }
);
VerificationSchema.set("timestamps", true);

VerificationSchema.pre("save", async function (done) {
  if (this.isModified("code")) {
    const hashed = await Password.toHash(this.get("code"));
    this.set("code", hashed);
  }
  done();
});

VerificationSchema.statics.build = (attrs: VerificationAttrs) => {
  return new Verification(attrs);
};

const Verification = mongoose.model<VerificationDoc, VerificationModel>(
  "Verification",
  VerificationSchema
);

export { Verification };
