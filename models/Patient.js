import mongoose from "mongoose";

const patientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    issues: {
        type: String,
        required: true,
    },
    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinarian",
    },
}, { timestamps: true });

const Patient = mongoose.model("Patients", patientsSchema);

export default Patient;