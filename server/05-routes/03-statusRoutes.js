const Express = require("express");
const router = Express.Router()

const { 
    PostStatus,
    GetStatuses,
    GetStatusById,
    AddComment
} = require("../04-controllers/03-statusController")

const { pdfDocumentUpload } = require("../03-middlewares/imageUpload")

router.post("/post-status",  PostStatus)
router.get("/get-statuses", GetStatuses)
router.get("/get-status/:id", GetStatusById)
// router.put("/add-comment/:id", AddComment)

module.exports = router