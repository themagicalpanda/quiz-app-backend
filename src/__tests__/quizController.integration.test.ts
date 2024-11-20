// @ts-nocheck

import request from 'supertest';
import express, { Application } from 'express';
import { createQuizController, getQuizController, submitAnswerController, getResultsController } from '../controllers/quizController';
import { createQuiz, getQuizById, saveAnswer, getResultByQuizIdAndUserId } from '../db/db';

// In-memory mock database for testing
let quizzes: any[] = [];
let answers: any[] = [];
let results: any[] = [];

// Simulating DB functions
jest.mock('../db/db', () => ({
  createQuiz: (quiz: any) => quizzes.push(quiz),
  getQuizById: (quizId: number) => quizzes.find(quiz => quiz.id === quizId),
  saveAnswer: (quizId: number, answer: any) => answers.push({ quizId, ...answer }),
  getResultByQuizIdAndUserId: (quizId: number, userId: number) => results.find(result => result.quiz_id === quizId && result.user_id === userId),
}));

describe('Quiz Controller Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/quizzes', createQuizController);
    app.get('/quizzes/:id', getQuizController);
    app.post('/quizzes/:quizId/answers', submitAnswerController);
    app.get('/quizzes/:id/results', getResultsController);
  });

  beforeEach(() => {
    quizzes = [];
    answers = [];
    results = [];
  });

  describe('createQuizController', () => {
    it('should create a quiz successfully with valid data', async () => {
      const quizData = {
        title: 'Sample Quiz',
        questions: [
          { id: 1, text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 },
        ],
      };

      const response = await request(app).post('/quizzes').send(quizData);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(201);
      expect(response.body.message).toBe('Quiz created successfully');
      expect(response.body.data.title).toBe(quizData.title);
      expect(response.body.data.questions).toEqual(quizData.questions);
      expect(quizzes.length).toBe(1);
    });

    it('should return a 400 error if the title is missing', async () => {
      const quizData = { questions: [{ text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 }] };

      const response = await request(app).post('/quizzes').send(quizData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Title and at least one question required');
    });
  });

  describe('getQuizController', () => {
    it('should return a 200 and quiz without correct answers', async () => {
      const quizData = {
        id: 1,
        title: 'Sample Quiz',
        questions: [
          { id: 1, text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 },
        ],
      };

      quizzes.push(quizData);

      const response = await request(app).get('/quizzes/1');

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.questions[0]).not.toHaveProperty('correct_option');
    });

    it('should return 404 if quiz is not found', async () => {
      const response = await request(app).get('/quizzes/999');  // Non-existent quiz

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Quiz not found');
    });
  });

  describe('submitAnswerController', () => {
    it('should return 200 and submit the correct answer', async () => {
      const quizData = {
        id: 1,
        title: 'Sample Quiz',
        questions: [
          { id: 1, text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 },
        ],
      };

      quizzes.push(quizData);

      const answerData = { quizId: 1, questionId: 1, selectedOption: 3 };

      const response = await request(app).post('/quizzes/1/answers').send(answerData);

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.is_correct).toBe(true);
      expect(answers.length).toBe(1); // Answer should be saved
      expect(answers[0].selected_option).toBe(3);
    });

    it('should return 404 if the quiz is not found', async () => {
      const answerData = { quizId: 999, questionId: 1, selectedOption: 3 };

      const response = await request(app).post('/quizzes/999/answers').send(answerData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Quiz not found');
    });

    it('should return 404 if the question is not found', async () => {
      const quizData = {
        id: 1,
        title: 'Sample Quiz',
        questions: [
          { id: 1, text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 },
        ],
      };

      quizzes.push(quizData);

      const answerData = { quizId: 1, questionId: 999, selectedOption: 3 };

      const response = await request(app).post('/quizzes/1/answers').send(answerData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Question not found');
    });
  });

  describe('getResultsController', () => {
    it('should return 200 and calculate the user\'s score', async () => {
      const quizData = {
        id: 1,
        title: 'Sample Quiz',
        questions: [
          { id: 1, text: 'What is 2 + 2?', options: [2, 3, 4], correct_option: 3 },
        ],
      };

      const resultData = {
        quiz_id: 1,
        user_id: 1,
        answers: [{ question_id: 1, selected_option: 3 }],
      };

      quizzes.push(quizData);
      results.push(resultData);

      const response = await request(app).get('/quizzes/1/results');

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data.score).toBe(1);
    });

    it('should return 404 if quiz is not found', async () => {
      const response = await request(app).get('/quizzes/999/results');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Results not found');
    });

    it('should return 404 if results are not found', async () => {
      const response = await request(app).get('/quizzes/1/results');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Results not found');
    });
  });

});
