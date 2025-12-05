// External Dependencies
import express from "express";

// Internal Dependencies
// Services
import { connectToDatabase } from "./services/database.service"

// Routes
import { adminRouter } from "./routes/admin.router";
import { usersRouter } from "./routes/users.router";
import { clubsRouter } from "./routes/clubs.router";
import { traitsRouter } from "./routes/traits.router";
import { recommendationRouter } from "./routes/recommendation.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase()
    .then(() => {
        app.use("/adminpass", adminRouter);
        app.use("/users", usersRouter);
        app.use("/clubs", clubsRouter);
        app.use("/recommendations", recommendationRouter);
        app.use("/traits", traitsRouter);


        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });