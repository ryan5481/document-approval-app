const mongoose = require ("mongoose");

const dataDocumentSchema = ({

    initiatorId: {
        type: String,
    },

    initiatorName: {
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

    createdAt: { type: Date, default: Date.now },
    
    updatedAt: { type: Date, default: Date.now },

})

const DataDocument = mongoose.model("DataDocument", dataDocumentSchema);

module.exports = DataDocument


