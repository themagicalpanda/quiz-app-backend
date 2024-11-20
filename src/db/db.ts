import { Answer } from "../models/answer";
import { Quiz } from "../models/quiz";
import { Result } from "../models/result";

interface InMemoryDB {
  quizzes: { [key: number]: Quiz };
  results: { [key: number]: Result };
}

const db: InMemoryDB = {
  quizzes: {},
  results: {},
};

// CRUD Operations for Quizzes
export const createQuiz = (quiz: Quiz): Quiz => {
  db.quizzes[quiz.id] = quiz;
  return quiz;
};

export const getQuizById = (quizId: number): Quiz | undefined => {
  return db.quizzes[quizId];
};

export const getResultByQuizIdAndUserId = (quizId: number, userId: number): Result | undefined => {
  return db.results[quizId];
};

export const saveAnswer = (quizId: number, answer: Answer): Answer => {
  const result = db.results[quizId];
  if (result) {
    result.answers.push(answer);
  } else {
    db.results[quizId] = { quiz_id: quizId, user_id: 1, score: 0, answers: [answer] };
  }
  return answer;
};
