import express, { Express, Request, Response } from "express";
import { router as v1 } from "./routes/v1/index";

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Route */
app.use("/api", v1);

/* Main Route */

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message:
      "You are on node-typescript-express. You should not have further access from here.",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
