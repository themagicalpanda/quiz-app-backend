const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// // Create a quiz
router.post("/quizzes", quizController.createQuizController);

// // // Get quiz by ID
router.get("/quizzes/:id", quizController.getQuizController);

// // // Submit answer for a specific question
router.post("/quizzes/:quizId/answers", quizController.submitAnswerController);

// // // Get results for a quiz
router.get("/quizzes/:id/results", quizController.getResultsController);

export default router;
