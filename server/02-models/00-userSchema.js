const mongoose = require ("mongoose");

const userSchema = ({

    fullName: {
        type: String,
    },
    
    email: {
        type: String,
    },
    
    phoneNumber: {
        type: String,
    },
    
    password: {
        type: String,
    },

    userRole: {
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


