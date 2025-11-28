import express from "express";
import { connectToDatabase } from "./services/database.service"
import { usersRouter } from "./routes/users.router";
import { userResultsRouter } from "./routes/userResults.router";
import { clubsRouter } from "./routes/clubs.router";
import { clubResultsRouter } from "./routes/clubResults.router";
import { recommendationRouter } from "./routes/recommendation.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase()
    .then(() => {
        app.use("/users", usersRouter);
        app.use("/users/results", userResultsRouter);
        app.use("/clubs", clubsRouter);
        app.use("/clubs/results", clubResultsRouter);
        app.use("/recommendations", recommendationRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });