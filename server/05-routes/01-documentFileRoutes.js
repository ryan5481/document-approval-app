const Express = require("express");
const router = Express.Router()

const { 
    InitiateDocument,
    GetSubmissions,
    GetASubmissionById,
    AddComment
} = require("../04-controllers/01-documentController")

const { pdfDocumentUpload } = require("../03-middlewares/imageUpload")

router.post("/initiate",pdfDocumentUpload, InitiateDocument)
router.get("/get-submissions", GetSubmissions)
router.get("/get-submission-by-id/:id", GetASubmissionById)
router.put("/add-comment/:id", AddComment)

module.exports = router