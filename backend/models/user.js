import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Move authProvider to main schema and add it first
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    // Make password conditional based on authProvider
    password: { 
      type: String, 
      required: [
        function() {
          return this.authProvider === 'local' || this.authProvider === undefined;
        },
        'Password is required for local authentication'
      ],
      select: false 
    },
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAOtp: { type: String, select: false },
    twoFAOtpExpires: { type: Date, select: false },
    // Add Google ID for OAuth users
    googleId: { type: String, sparse: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;