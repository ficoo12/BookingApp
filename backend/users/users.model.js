const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("findOneAndUpdate", async function (next) {
  this._update.password = await bcrypt.hash(this._update.password, 10);
  next();
});

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
