const { default: mongoose } = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    refresh_token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
