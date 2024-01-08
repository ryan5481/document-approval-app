const User = require("../02-models/00-userSchema")
const bcrypt = require("bcrypt")


const Login = async (req, res) => {
  try {
    // console.log(req.body)
    const foundUser = await User.findOne({ email: req.body.email })

    if (foundUser) {
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

    const encryptedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = encryptedPassword

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

const GetUsersList = async (req, res) => {
  try {
    //get users with userRole == "user"
    const queryObj = { userRole: "user" }
      const usersWithPassword = await User.find(queryObj);
      // Remove password field from each user object
    const data = usersWithPassword.map(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

      if (data) {
          res.status(200).json({
              data
          });
      } else {
          res.json({ msg: "Error fetching users list." });
      }
  } catch (error) {
      console.error("Error", error);
      return res.status(500).json({ msg: "Internal server error." });
  }
}

exports.Login = Login
exports.CreateUser = CreateUser

exports.GetUsersList = GetUsersList
