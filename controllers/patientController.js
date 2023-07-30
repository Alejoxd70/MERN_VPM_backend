import Patient from "../models/Patient.js";


const addPatients = async (req, res) => {

    const patient = new Patient(req.body);
    patient.veterinarian = req.veterinarian._id;

    try {
        const patientSaved = await patient.save();
        res.json(patientSaved);
    } catch (error) {
        console.log(error);
    }

}

const getPatients = async (req, res) => {

    const patients = await Patient.find().where("veterinarian").equals(req.veterinarian);

    res.json(patients);
}

const getPatient = async (req, res) => {
    try {
        const { id } = req.params;
    
        const patient = await Patient.findById(id);
    
        if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
            return res.json({ msg: "Action invalid" });
        }
        //update patient
        res.json(patient);
        
    } catch (error) {
        return res.status(404).json({ msg: "The patient has not been found" });
    }
}

const updatePatient = async (req, res) => {

    try {
        const { id } = req.params;
    
        const patient = await Patient.findById(id);
    
        if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
            return res.json({ msg: "Action invalid" });
        }
    
        //update patient
        patient.name = req.body.name || patient.name;
        patient.owner = req.body.owner || patient.owner;
        patient.email = req.body.email || patient.email;
        patient.date = req.body.date || patient.date;
        patient.issues = req.body.issues || patient.issues;
        
        try {
            const patientUpdated = await patient.save();
            res.json(patientUpdated);
        } catch (error) {
            console.log(error);
        }
        
    } catch (error) {
        return res.status(404).json({ msg: "The patient has not been found" });
    }
}

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
    
        const patient = await Patient.findById(id);

        if(!patient) {
            return res.status(404).json({ msg: "The patient has not been found" });
        }
    
        if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
            return res.json({ msg: "Action invalid" });
        }
        
        //delete patient
        try {
            await patient.deleteOne();
            res.json({msg: "The patient has been deleted correctly"});
        } catch (error) {
            console.log(error);
        }
        
    } catch (error) {
        return res.status(404).json({ msg: "The patient has not been found" });
    }
}

export {
    addPatients,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
}