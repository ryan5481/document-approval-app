const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentText: {
    type: Object,
    required: true,
  },

  InspectorId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

});

const statusSchema = new mongoose.Schema({

  status: [
    {
      state: {
        type: String,
        required: true,
        // initiated, approved, rejected
      },
      operator: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
    },
  ],

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

  firstAssigneeDept: {
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

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  ////////// COMMENTS ////////
  comments: [commentSchema],

})



const StatusModel = mongoose.model('Status', statusSchema);

module.exports = StatusModel;
