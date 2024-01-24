const StatusModel = require("../02-models/03-statusSchema")
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
        console.log(firstAssignee)

        if (!firstAssignee) {
            return res.status(404).json({
                msg: "First assignee not found."
            });
        }

        const reqInclFile = {
            ...req.body,
            pdfFile: req.file.filename,
            firstAssigneeName: firstAssignee.fullName,
            firstAssigneeDept: firstAssignee?.department,
            status: {
                state: "initiated",
                operator: req.body.initiatorId
            }
        };

        const data = await StatusModel.create(reqInclFile);

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


const GetSubmissions = async (req, res) => {
    try {
        const foundData = await StatusModel.find().populate('status.operator', 'userName');

        if (foundData) {
            const populatedDataWithInitiatorName = await Promise.all(foundData.map(async item => {
                const user = await User.findById(item.initiatorId);
                if (user) {
                    const populatedStatus = await Promise.all(item.status.map(async (statusItem, index) => {
                        const operatorUser = await User.findById(statusItem.operator);
                        if (operatorUser) {
                            const updatedStatusItem = {
                                ...statusItem.toObject(),
                                operatorName: operatorUser.fullName,
                                operatorUserDept: operatorUser?.department,
                                operatorUserRole: operatorUser?.userRole,
                            };

                            // Check if the last object in the status array has rejectedToAsignee
                            if (index === item.status.length - 1 && statusItem.rejectedToAsignee) {
                                const rejectedToAsigneeUser = await User.findById(statusItem.rejectedToAsignee);
                                if (rejectedToAsigneeUser) {
                                    updatedStatusItem.rejectedToAsigneeName = rejectedToAsigneeUser.fullName;
                                } else {
                                    console.error(`User with _id ${statusItem.rejectedToAsignee} not found`);
                                }
                            }

                            return updatedStatusItem;
                        } else {
                            console.error(`User with _id ${statusItem.operator} not found`);
                            return statusItem.toObject();
                        }
                    }));

                    return {
                        ...item.toObject(),
                        initiatorName: user.fullName,
                        initiatorUserRole: user.userRole,
                        status: populatedStatus
                    };
                } else {
                    console.error(`User with _id ${item.initiatorId} not found`);
                    return item.toObject();
                }
            }));

            res.status(200).json({
                foundData: populatedDataWithInitiatorName
            });
        } else {
            res.status(401).json({ msg: "Error" });
        }
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};




const GetASubmissionById = async (req, res) => {
    try {
        const data = await StatusModel.findById(req.params.id)
            .populate({
                path: "comments.InspectorId",
                model: "User",
                select: "fullName department userRole",
            })
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
        const { commentText, InspectorId } = req.body;

        if (!commentText) {
            return res.status(400).json({ msg: "No valid comment text provided." });
        }
        //ADD A NEW COMMENT OBJECT INTO COMMENTS ARRAY
        const updated = await StatusModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: { commentText, InspectorId },
                    status: { state: "inspected", operator: InspectorId }
                }
            },
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

const UpdateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { state, operator, rejectedToAsignee } = req.body;

        if (!state) {
            return res.status(400).json({ msg: "No valid comment data provided." });
        }
        //ADD A NEW COMMENT OBJECT INTO COMMENTS ARRAY
        const updated = await StatusModel.findByIdAndUpdate(
            id,
            { $push: { status: { state, operator, rejectedToAsignee } } },
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


exports.InitiateDocument = InitiateDocument
exports.GetSubmissions = GetSubmissions
exports.GetASubmissionById = GetASubmissionById
exports.AddComment = AddComment
exports.UpdateStatus = UpdateStatus
