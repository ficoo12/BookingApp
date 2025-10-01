const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY;

const Token = require("./token.model");
const User = require("./user.model");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not Found!" });
    }
    if (user.password !== password) {
      return res.status(401).send({ message: "Invalid password!" });
    }
    const payload = {
      sub: user._id,
      given_name: user.firstname,
      family_name: user.lastname,
    };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: 5 * 60 });
    const refresh_token = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: 5 * 24 * 60 * 60,
    });
    try {
      const newToken = await Token({ refresh_token });
      await newToken.save();

      return res.status(200).json({
        message: "Authentication successful",
        access_token,
        refresh_token,
        user,
        payload,
      });
    } catch (error) {
      console.error("Error creating token", error);
      return res.status(500).send({ message: "Failed to create token" });
    }
  } catch (error) {
    console.error("Error fetching user", error);
    return res.status(500).send({ message: "Failed to fetch user" });
  }
};

const logoutUser = async (req, res) => {
  const refresh_token = req.body.refresh_token;
  jwt.verify(refresh_token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid credientials" });
    }
    try {
      const deletedToken = await Token.findOneAndDelete({ refresh_token });
      if (!deletedToken) {
        res.status(404).send({ message: "Token is not Found!" });
        return;
      }
      res.status(200).send({
        message: "Token deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting a token", error);
      res.status(500).send({ message: "Failed to delete a token" });
    }
  });
};

const refreshToken = async (req, res) => {
  const refresh_token = req.body.refresh_token;
  jwt.verify(refresh_token, JWT_SECRET, async (err, user) => {
    // console.log(user);
    if (err) {
      return res.status(403).json({ message: "Invalid credientials" });
    }
    try {
      const refresh_token_returned = await Token.find({ refresh_token });
      if (!refresh_token_returned.length) {
        res.status(404).send({ message: "Invalid token (not on whitelist)!" });
        return;
      }
      try {
        const deletedToken = await Token.findOneAndDelete({ refresh_token });
        if (!deletedToken) {
          res.status(404).send({ message: "Token is not Found!" });
          return;
        }
        try {
          const user_returned = await User.findById(user.sub);
          if (!user_returned) {
            res.status(404).send({ message: "User not Found!" });
            return;
          }
          const payload = {
            sub: user_returned._id,
            given_name: user_returned.firstname,
            family_name: user_returned.lastname,
          };
          const access_token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: 5 * 60,
          });
          const refresh_token = jwt.sign(
            { sub: user_returned._id },
            JWT_SECRET,
            {
              expiresIn: 5 * 24 * 60 * 60,
            }
          );
          try {
            const newToken = await Token({ refresh_token });
            await newToken.save();

            res.status(200).json({
              message: "Tokens created successful",
              access_token,
              refresh_token,
            });
          } catch (error) {
            console.error("Error creating token", error);
            res.status(500).send({ message: "Failed to create token" });
          }
        } catch (error) {
          console.error("Error fetching user", error);
          res.status(500).send({ message: "Failed to fetch user" });
        }
      } catch (error) {
        console.error("Error deleting a token", error);
        res.status(500).send({ message: "Failed to delete a token" });
      }
    } catch (error) {
      console.error("Error fetching token", error);
      res.status(500).send({ message: "Failed to fetch token" });
    }
  });
};

module.exports = {
  loginUser,
  logoutUser,
  refreshToken,
};
