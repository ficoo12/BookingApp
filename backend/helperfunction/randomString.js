const { randomBytes } = require("node:crypto");

const randomString = (length) => {
  if (length % 2 !== 0) {
    length++;
  }

  return randomBytes(length / 2).toString("hex");
};

module.exports = randomString;
