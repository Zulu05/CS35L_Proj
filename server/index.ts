import express from "express";
import { connectToDatabase } from "./services/database.service"
import { siteRouter } from "./routes/router";

// 1️⃣ Create the Express app instance
const app = express();

// 2️⃣ Choose a port for your server
const port = process.env.PORT || 5173;

connectToDatabase()
    .then(() => {
        app.use("/clubs", siteRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });