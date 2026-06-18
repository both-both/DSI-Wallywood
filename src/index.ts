import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { testRoutes } from "./routes/testRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
dotenv.config();

// sætter port
const port = process.env.PORT;
// Opretter express objekt
const app = express();
app.use(express.urlencoded({ extended: true }));
// Gør det muligt at modtage JSON data
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Forsiden");
});
// Tilføjer routes til applikationen
// anvender opdelte routes
app.use("/users", userRoutes);

// 404 Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "404 - Bad endpoint", // object sent as json
  });
});

app.listen(port, () => {
  console.log(`server is running og port http://localhost:${port}`);
});
