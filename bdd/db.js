// db.js
const mongoose = require("mongoose");

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("❌ MONGODB_URI is not defined in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // exit process if DB fails to connect
    }
}

module.exports = connectDB;
