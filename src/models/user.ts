import mongoose from "mongoose";
import { hash, compare } from "bcryptjs";
interface UserAttributes {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  role: string;
  correctPassword: Function;
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  createdAt: Date;
  changedPasswordAfter: Function;
}

const userSchema = new mongoose.Schema(
  {
    
    email: {
      type: String,
      required: [true, "a user must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "a user must have a password"],
    },
    username: {
      type: String,
      required: [true, "a user must have a username"],
    },
    role: {
      type: String,
      enum: ["client", "admin", "user"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  
  if (!this.isModified("password")) return next();
  const hashed = await  hash(this.get("password"), 12); 
  this.set("password", hashed); 
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await compare(candidatePassword, userPassword);
};

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   console.log({ resetToken }, this.passwordResetToken);

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.get("passwordChangedAt")) {
    const passwordChangedAt: Date = this.get("passwordChangedAt");
    const changedTimestamp = parseInt(
      (passwordChangedAt.getTime() / 1000).toString(),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
