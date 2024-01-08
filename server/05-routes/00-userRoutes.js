const Express = require("express");
const router = Express.Router()

const { 
    Login,
    CreateUser,
    GetUsersList //get users with userRole == "user"
    // ChangeUserPassword,
    // GetUserProfile
} = require("../04-controllers/00-userController")

router.post("/login", Login)
router.post("/signup", CreateUser)
router.get("/get-users-list", GetUsersList)
// router.patch("/edit-user-profile/:id", EditUserProfile)
// router.patch("/change-user-password/:id", ChangeUserPassword)
// router.get("/get-user-profile/:id", GetUserProfile)

module.exports = router