const randomString = require("../helperfunction/randomString");

const Users = require("./users.model");

const createUser = async (req, res) => {
  try {
    const token = randomString(64);
    const newUser = await Users({ ...req.body, token });
    await newUser.save();
    res
      .status(200)
      .send({ message: "User posted successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
