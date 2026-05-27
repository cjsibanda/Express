const mongoose = require("mongoose");
const bcyptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        "type": String,
        "required": true
    },
    lastName: {
        "type": String,
        "required": true
    },
    email: {
        "type": String,
        "required": true,
        "unique": true 
    },
    password: {
        "type" : String,
        "required": true
    },
    profilePic: String,
    dateCreated: {
        "type": Date,
        "default": Date.now
    }
});

userSchema.pre("save", async function() {
    const user = this;

    if (!user.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);

        //set the password to hashed version
        user.password = await bcrypt.hash(user.password, salt);
    }
    catch (err) {
        throw new Error(`Hashing failed: ${err.message}`);
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;