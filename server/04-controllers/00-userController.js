const User = require("../02-models/00-userSchema")
const bcrypt = require("bcrypt")


const Login = async (req, res) => {
  try {
    // console.log(req.body)
    const foundUser = await User.findOne({ email: req.body.email })

    if (foundUser) {
      console.log("User Exists");
      const passMatch = await bcrypt.compare(req.body.password, foundUser.password);

      if (passMatch) {
        console.log("Password matched.");
        delete foundUser.password;
        console.log(foundUser)
        res.status(200).json({
          msg: "Logged in.",
          id: foundUser._id,
          fullName: foundUser.fullName,
          email: foundUser.email,
          userRole: foundUser.userRole,
        })
      } else {
        res.status(401).json({
          msg: "Invalid credentials"
        })
      }
    } else {
      res.status(401).json({
        msg: "Invalid credentials"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error connecting to server."
    })
  }
}

const CreateUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email })

    if(foundUser){
      return res.status(403).json({
        msg: "Email exists."
      })
    }

    const data = await User.create(req.body)
    if (data) {
      res.status(200).json({
        msg: "User profile created successfully."
      })
    } else {
      res.status(403).json({
        msg: "User registration failed."
      })
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
}

exports.Login = Login
exports.CreateUser = CreateUser

