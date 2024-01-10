const Express = require("express");
const router = Express.Router()

const { 
    InitiateDocument,
    GetDataDocuments,
    GetOneDataById
} = require("../04-controllers/01-documentController")

const { pdfDocumentUpload } = require("../03-middlewares/imageUpload")

router.post("/initiate",pdfDocumentUpload, InitiateDocument)
router.get("/get-submissions", GetDataDocuments)
router.get("/get-data/:id", GetOneDataById)

module.exports = router