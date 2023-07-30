import mongoose from "mongoose";
import bcrypt from "bcrypt"

const vetSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,

    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    telNumber: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
    },
    authentication: {
        type: Boolean,
        default: false,
    }
});

vetSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

vetSchema.methods.checkPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password); 
}



const Veterinarian = mongoose.model("Veterinarian", vetSchema);
export default Veterinarian;