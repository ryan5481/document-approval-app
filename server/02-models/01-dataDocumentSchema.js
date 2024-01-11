const mongoose = require ("mongoose");

const dataDocumentSchema = ({

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

    comment: {
        type: Object,
    },
    
    pdfFile: {
        type: String,
    },

    fileTitle: {
        type: String,
    },


    initiated: {
        type: Number,
        default: 1
        //Need initiated === 1, conditional confirmation to start a thread for other users to start commenting
    },

    //COMMENTS
    items: [
        {
            id: {
                type: Number,
                required: true
            },
            
            name: {
                type: Object,
                required: true
            }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    
    updatedAt: { type: Date, default: Date.now },

})

const DataDocument = mongoose.model("DataDocument", dataDocumentSchema);

module.exports = DataDocument


