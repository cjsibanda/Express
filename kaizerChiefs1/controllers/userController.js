const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        "required": true
    },
    password: {
        "type": String,
        "required": true
    },
    profilePic: String,
    dateCreated: {
        "type": Date,
        "default": Date.now
    }
});

//Hash password when a new user is added
userSchema.pre("save", async function() {
    // 'this' referes to the user document/model
    const user = this;

    if (!user.isModified('password')) {
        //Password hasn't changed, do not hash
        return;
    }

    try {
        //Generate salt
        const salt = await bycrypt.genSalt(10);

        //Set the password to the hashed version
        user.password = await bcrypt.hash(user.password, salt);
    }
    catch (err) {
        throw new Error(`Hashing failed: ${err.message}`);
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;