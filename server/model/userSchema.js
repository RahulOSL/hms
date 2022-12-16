const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


//Create user schema for storing the data of Users
const userSchema = new mongoose.Schema({
    user_type: {
        type: String,
    },
    name: {
        type: String,
    },
    department: {
        type: String,
    },
    email: {
        type: String,
    },
    doctor_fees: {
        type: Number
    },
    password: {
        type: String,
        min: 8,
    },
    expireToken: {
        type: Date
    },
    //this is for generating jwt token
    jwtTokens: [{
        jwtToken: {
            type: String,
            // required: true
        }
    }],

});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})


//Generating authenticate token 
userSchema.methods.generateAuthToken = async function () {
    try {
        let jwtToken = jwt.sign({
            _id: this._id
        }, process.env.SECRET_KEY);
        this.jwtTokens = this.jwtTokens?.concat({
            jwtToken: jwtToken
        });
        await this.save();
        return jwtToken;
    } catch (err) {
        console.log(err);
    }
}





//Here crete User collection for storing documents.
const User = new mongoose.model('Users', userSchema)

// Create or Add documents in user collection
const createDocuments = async () => {
    try {
        const users = new User({ user_type: "Admin", name: "Sayaib Sarkar", department: "Neuro-Sergen", email: "admin@gmail.com", password: "Test@111" });

        const result = await users.save();
        //console.log(result);
    } catch (error) {
        console.log(error);
    }

}
// createDocuments();



module.exports = User;