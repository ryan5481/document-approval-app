const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentText: {
    type: Object,
    required: true,
  },
});

const statusSchema = new mongoose.Schema({

  initiatorId: {
    type: String,
},

initiatorName: {
    type: String,
},

firstAssigneeId: {
    type: String,
},

firstAssigneeName: {
    type: String,
},

inspectors: {
    type: Object,
},

approved: {
    type: Boolean,
},

title: {
    type: String,
},

////////// DOCUMENT DATA ////////
pdfFile: {
    type: String,
},

fileTitle: {
    type: String,
},

instruction: {
  type: Object,
},

////////// COMMENTS ////////
  comments: [commentSchema],
});

const StatusModel = mongoose.model('Status', statusSchema);

module.exports = StatusModel;
