import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectDB from "./config/db.js";
import veterinarianRoutes from "./routes/veterinarianRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";


const app = express(); 
app.use(express.json()); //allow use json

dotenv.config(); //evironment variables

conectDB(); //data base

//allow CORS policy
const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1){
            //The request origin is allowed
            callback(null, true)
        } else {
            callback(new Error("Has been blocked by CORS"));    
        }
    }
}
app.use(cors(corsOptions));


app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
});

