const DataDocument = require("../02-models/01-dataDocumentSchema")
const User = require("../02-models/00-userSchema")
const dotenv = require("dotenv");
dotenv.config();

const InitiateDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                msg: "File not received."
            });
        }

        // Get the name of the first asignee from User model using _id received form req.body
        const firstAssignee = await User.findById(req.body.firstAssigneeId);

        if (!firstAssignee) {
            return res.status(404).json({
                msg: "First assignee not found."
            });
        }

        const reqInclFile = {
            ...req.body,
            pdfFile: req.file.filename,
            firstAssigneeName: firstAssignee.fullName
        };

        const data = await DataDocument.create(reqInclFile);

        if (data) {
            res.status(200).json({
                msg: "Initial document saved."
            });
        } else {
            res.status(403).json({
                msg: "Failed to save data."
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};


const GetDataDocuments = async (req, res) => {
  try {
     
      const foundData = await DataDocument.find();

      if (foundData) {
          res.status(200).json({
            foundData
          });
      } else {
          res.status(401).json({ msg: "Error" });
      }
  } catch (error) {
      console.error("Error", error);
      return res.status(500).json({ msg: "Internal server error." });
  }
}

exports.InitiateDocument = InitiateDocument
exports.GetDataDocuments = GetDataDocuments

