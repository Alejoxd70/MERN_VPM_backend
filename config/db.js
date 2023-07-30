import mongoose from "mongoose";

const conectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB on ${url}`);

    } catch (error) {
        console.log(`Error connect mongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default conectDB;