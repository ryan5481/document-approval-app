const Express = require("express");
const router = Express.Router()

const { 
    Login,
    // UserSignUp,
    // EditUserProfile,
    // ChangeUserPassword,
    // GetUserProfile
} = require("../04-controllers/00-userController")

router.post("/login", Login)
// router.post("/user-signup", UserSignUp)
// router.patch("/edit-user-profile/:id", EditUserProfile)
// router.patch("/change-user-password/:id", ChangeUserPassword)
// router.get("/get-user-profile/:id", GetUserProfile)

module.exports = router