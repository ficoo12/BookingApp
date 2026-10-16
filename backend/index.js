// dotenv must load before ./app: verifyToken.js and user.controller.js read
// SECRET_KEY when they are first required.
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 8080;

main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

app.listen(port, () => {
  console.log(`Express app is running on port ${port}`);
});
