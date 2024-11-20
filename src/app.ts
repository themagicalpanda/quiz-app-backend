import express from "express";
import { seedDatabase } from "./seed";
import quizRoutes from "./routes/quizRoutes"; // Using ES6 import for consistency

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Use express's built-in JSON body parser

// Routes
app.use("/api", quizRoutes);

// Initialize the in-memory database and seed it
seedDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
