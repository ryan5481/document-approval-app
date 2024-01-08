const mongoose = require ("mongoose");

const userSchema = ({

    userRole: {
        type: String,
    },
    
    fullName: {
        type: String,
    },

    email: {
        type: String,
    },
    
    password: {
        type: String,
    },

    department: {
        type: String,
    },

    createdAt: { type: Date, default: Date.now },
    
    updatedAt: { type: Date, default: Date.now },

})

const User = mongoose.model("User", userSchema);

module.exports = User


