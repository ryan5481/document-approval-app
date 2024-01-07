const multer = require('multer')

//STUDENT PROFILE IMAGE
const pdfDocumentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/uploads/documentPdfs/")
    },
    filename: function (req, file, cb) {
        cb(null, "document_pdf_" + Date.now() + ".pdf")
    }
})

const pdfDocumentUpload = multer({
    storage: pdfDocumentStorage,
}).single("pdfFile")

exports.pdfDocumentUpload = pdfDocumentUpload;
