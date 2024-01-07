const Express = require("express");
const router = Express.Router()

const { 
    InitiateDocument,
    GetDataDocuments
} = require("../04-controllers/01-documentController")

const { pdfDocumentUpload } = require("../03-middlewares/imageUpload")

router.post("/initiate",pdfDocumentUpload, InitiateDocument)
router.get("/get-submissions", GetDataDocuments)

module.exports = router