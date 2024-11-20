import { Question } from "./question";

export interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}