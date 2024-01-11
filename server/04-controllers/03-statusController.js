const StatusModel = require("../02-models/03-statusSchema")
const dotenv = require("dotenv");
dotenv.config();

const PostStatus = async (req, res) => {
    try {
        const data = await StatusModel.create(req.body);

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


const GetStatuses = async (req, res) => {
  try {
     
      const data = await StatusModel.find();

      if (data) {
          res.status(200).json({
            data
          });
      } else {
          res.status(401).json({ msg: "Error" });
      }
  } catch (error) {
      console.error("Error", error);
      return res.status(500).json({ msg: "Internal server error." });
  }
}

const GetStatusById = async (req, res) => {
  try {
      const data = await StatusModel.findById(req.params.id);
      if (data) {
          res.status(200).json({
            data
          });
      } else {
          res.status(401).json({ msg: "Error" });
      }
  } catch (error) {
      console.error("Error", error);
      return res.status(500).json({ msg: "Internal server error." });
  }
}

const AddComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { commentText } = req.body;

        if (!commentText) {
            return res.status(400).json({ msg: "No valid comment text provided." });
        }

        const updated = await StatusModel.findByIdAndUpdate(
            id,
            { $push: { comments: { commentText } } },
            { new: true } 
        );

        if (updated) {
            return res.status(200).json({
                msg: "Comment added successfully.",
                updated 
            });
        } else {
            return res.status(404).json({
                msg: "Data not found." 
            });
        }
    } catch (err) {
        console.error("Error: " + err);
        return res.status(500).json({
            msg: "Internal server error." 
        });
    }
};


exports.PostStatus = PostStatus
exports.GetStatuses = GetStatuses
exports.GetStatusById = GetStatusById
exports.AddComment = AddComment

