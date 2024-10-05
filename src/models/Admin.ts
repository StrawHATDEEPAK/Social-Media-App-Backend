import mongoose from "mongoose";
import { Password } from "../services/password";

interface AdminAttrs {
  email?: string;
  password?: string;
  username: string;
}

interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
}

export interface AdminDoc extends mongoose.Document {
  email?: string;
  password?: string;
  username?: string;
}

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
AdminSchema.set("timestamps", true);

AdminSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

AdminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>("Admin", AdminSchema);

export { Admin };
