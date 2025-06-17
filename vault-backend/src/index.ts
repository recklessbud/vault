// dependencies
import "express-async-errors";
import app from "./app";
import dotenv from "dotenv";

//config
dotenv.config();
//port environment variable
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (error: unknown) => {
  console.error(error);
});

//start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
