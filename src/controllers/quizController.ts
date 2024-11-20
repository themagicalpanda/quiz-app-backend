import { Request, Response } from "express";
import { Quiz } from "../models/quiz";
import {
  createQuiz,
  getQuizById,
  saveAnswer,
  getResultByQuizIdAndUserId,
} from "../db/db";
import { Answer } from "../models/answer";
import { Question } from "../models/question";

// Create a new quiz
export const createQuizController = (req: Request, res: Response): Response => {
  const { title, questions }: { title: string; questions: Question[] } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({
      code: 400,
      message: "Title and at least one question required",
      data: null,
    });
  }

  const newQuiz: Quiz = {
    id: Date.now(), // Use current timestamp as a unique id (Could use uuid)
    title,
    questions: questions.map((q, index) => ({
      ...q,
      id: index + 1,
    })),
  };

  createQuiz(newQuiz); // Save to in-memory DB
  return res.status(201).json({
    code: 201,
    message: "Quiz created successfully",
    data: newQuiz,
  });
};

// Get quiz by ID (without revealing correct answers)
export const getQuizController = (req: Request, res: Response): Response => {
  const quizId = parseInt(req.params.id);
  const quiz = getQuizById(quizId);

  if (!quiz) {
    return res.status(404).json({
      code: 404,
      message: "Quiz not found",
      data: null,
    });
  }

  // Remove the correct_option from each question before returning
  const sanitizedQuestions = quiz.questions.map((question) => {
    const { correct_option, ...sanitizedQuestion } = question;
    return sanitizedQuestion;
  });

  const { questions, ...quizInfo } = quiz;

  return res.status(200).json({
    code: 200,
    message: "Quiz retrieved successfully",
    data: {
      ...quizInfo,
      questions: sanitizedQuestions,
    },
  });
};

// Submit an answer for a specific question
export const submitAnswerController = (
  req: Request,
  res: Response
): Response => {
  const {
    quizId,
    questionId,
    selectedOption,
  }: { quizId: number; questionId: number; selectedOption: number } = req.body;

  const quiz = getQuizById(quizId);
  if (!quiz) {
    return res.status(404).json({
      code: 404,
      message: "Quiz not found",
      data: null,
    });
  }

  const question = quiz.questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({
      code: 404,
      message: "Question not found",
      data: null,
    });
  }

  const isCorrect = question.correct_option === selectedOption;

  const answer: Answer = {
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
  };

  // Save answer to in-memory DB
  saveAnswer(quizId, answer);

  return res.status(200).json({
    code: 200,
    message: "Answer submitted successfully",
    data: {
      is_correct: isCorrect,
      correct_option: question.correct_option,
    },
  });
};

// Get user's results for a specific quiz
export const getResultsController = (req: Request, res: Response): Response => {
  const quizId = parseInt(req.params.id);
  const result = getResultByQuizIdAndUserId(quizId, 1); // Assume user_id = 1 for simplicity
  if (!result) {
    return res.status(404).json({
      code: 404,
      message: "Results not found",
      data: null,
    });
  }

  // Fetch the quiz to compare answers with correct options
  const quiz = getQuizById(quizId);
  if (!quiz) {
    return res.status(404).json({
      code: 404,
      message: "Quiz not found",
      data: null,
    });
  }

  let score = 0;

  /**
   * Todo: Have it implemented in the in-memory db
   */
  const updatedAnswers = result.answers.map((answer) => {
    const question = quiz.questions.find((q) => q.id === answer.question_id);
    if (question && question.correct_option === answer.selected_option) {
      score += 1; // Increment score for correct answers
      return {
        ...answer,
        is_correct: true,
      };
    }
    return {
      ...answer,
      is_correct: false,
    };
  });

  return res.status(200).json({
    code: 200,
    message: "Results fetched successfully",
    data: {
      score: score,
      answers: updatedAnswers,
    },
  });
};
