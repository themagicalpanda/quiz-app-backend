import { Answer } from './answer';

export interface Result {
  quiz_id: number;
  user_id: number;
  score: number;
  answers: Answer[];
}
