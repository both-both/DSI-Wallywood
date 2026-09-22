import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { userRoutes } from "./routes/userRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { posterRoutes } from "./routes/posterRoutes.js";
import { genreRoutes } from "./routes/genreRoutes.js";
import { cartlineRoutes } from "./routes/cartlineRoutes.js";
import { userRatingRoutes } from "./routes/userRatingRoutes.js";
import cors from "cors";

dotenv.config();

// sætter port
const port = process.env.PORT;

// Opretter express objekt
const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));

// Gør det muligt at modtage JSON data
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Forsiden");
});
// Tilføjer routes til applikationen
// anvender opdelte routes
app.use("/users", userRoutes);
app.use("/login", authRoutes);
app.use("/posters", posterRoutes);
app.use("/genre", genreRoutes);
app.use("/cartline", cartlineRoutes);
app.use("/userRating", userRatingRoutes);

// 404 Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "404 - Bad endpoint", // object sent as json
  });
});

app.listen(port, () => {
  console.log(`server is running og port http://localhost:${port}`);
});
