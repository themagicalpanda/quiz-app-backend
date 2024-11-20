// @ts-nocheck

import request from "supertest";
import express, { Application } from "express";
import {
  createQuizController,
  getQuizController,
  submitAnswerController,
  getResultsController,
} from "../controllers/quizController";
import {
  createQuiz,
  getQuizById,
  saveAnswer,
  getResultByQuizIdAndUserId,
} from "../db/db";

// Mocking the database functions
jest.mock("../db/db", () => ({
  createQuiz: jest.fn(),
  getQuizById: jest.fn(),
  saveAnswer: jest.fn(),
  getResultByQuizIdAndUserId: jest.fn(),
}));

describe("Quiz Controller Tests", () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/quizzes", createQuizController);
    app.get("/quizzes/:id", getQuizController);
    app.post("/submit-answer", submitAnswerController);
    app.get("/results/:id", getResultsController);
  });

  describe("createQuizController", () => {
    it("should create a quiz successfully with valid data", async () => {
      const quizData = {
        title: "Sample Quiz",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: [2, 3, 4],
            correct_option: 3,
          },
        ],
      };

      (createQuiz as jest.Mock).mockReturnValue(undefined);

      const response = await request(app).post("/quizzes").send(quizData);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(201);
      expect(response.body.message).toBe("Quiz created successfully");
      expect(response.body.data.title).toBe(quizData.title);
      expect(response.body.data.questions).toEqual(quizData.questions);
    });

    it("should return a 400 error if the title is missing", async () => {
      const quizData = {
        questions: [
          { text: "What is 2 + 2?", options: [2, 3, 4], correct_option: 3 },
        ],
      };

      const response = await request(app).post("/quizzes").send(quizData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Title and at least one question required"
      );
    });
  });

  describe("getQuizController", () => {
    it("should return a 200 and quiz without correct answers", async () => {
      const quizData = {
        id: 1,
        title: "Sample Quiz",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: [2, 3, 4],
            correct_option: 3,
          },
        ],
      };

      (getQuizById as jest.Mock).mockReturnValue(quizData);

      const response = await request(app).get("/quizzes/1");

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.questions[0]).not.toHaveProperty(
        "correct_option"
      );
    });

    it("should return 404 if quiz is not found", async () => {
      (getQuizById as jest.Mock).mockReturnValue(null);

      const response = await request(app).get("/quizzes/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Quiz not found");
    });
  });

  describe("submitAnswerController", () => {
    it("should return 200 and submit the correct answer", async () => {
      const quizData = {
        id: 1,
        title: "Sample Quiz",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: [2, 3, 4],
            correct_option: 3,
          },
        ],
      };

      (getQuizById as jest.Mock).mockReturnValue(quizData);

      const answerData = { quizId: 1, questionId: 1, selectedOption: 3 };

      const response = await request(app)
        .post("/submit-answer")
        .send(answerData);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.is_correct).toBe(true);
      expect(saveAnswer).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          question_id: 1,
          selected_option: 3,
          is_correct: true,
        })
      );
    });

    it("should return 404 if the quiz is not found", async () => {
      (getQuizById as jest.Mock).mockReturnValue(null);

      const answerData = { quizId: 999, questionId: 1, selectedOption: 3 };

      const response = await request(app)
        .post("/submit-answer")
        .send(answerData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Quiz not found");
    });

    it("should return 404 if the question is not found", async () => {
      const quizData = {
        id: 1,
        title: "Sample Quiz",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: [2, 3, 4],
            correct_option: 3,
          },
        ],
      };

      (getQuizById as jest.Mock).mockReturnValue(quizData);

      const answerData = { quizId: 1, questionId: 999, selectedOption: 3 };

      const response = await request(app)
        .post("/submit-answer")
        .send(answerData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Question not found");
    });
  });

  describe("getResultsController", () => {
    it("should return 200 and calculate the user's score", async () => {
      const quizData = {
        id: 1,
        title: "Sample Quiz",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: [2, 3, 4],
            correct_option: 3,
          },
        ],
      };

      const resultData = {
        quiz_id: 1,
        user_id: 1,
        answers: [{ question_id: 1, selected_option: 3 }],
      };

      (getQuizById as jest.Mock).mockReturnValue(quizData);
      (getResultByQuizIdAndUserId as jest.Mock).mockReturnValue(resultData);

      const response = await request(app).get("/results/1");

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.score).toBe(1); // Correct answer
    });

    it("should return 404 if quiz is not found", async () => {
      (getQuizById as jest.Mock).mockReturnValue(null);

      const response = await request(app).get("/results/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Quiz not found");
    });

    it("should return 404 if results are not found", async () => {
      (getResultByQuizIdAndUserId as jest.Mock).mockReturnValue(null);

      const response = await request(app).get("/results/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Results not found");
    });
  });
});
