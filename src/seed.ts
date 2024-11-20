import { Quiz } from "./models/quiz";
import { createQuiz } from "./db/db";

// Seed function to populate the in-memory database
export const seedDatabase = () => {
  const quiz1: Quiz = {
    id: 100,
    title: "General Knowledge Quiz",
    questions: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct_option: 2,
      },
      {
        id: 2,
        text: "Who wrote 'Hamlet'?",
        options: ["Shakespeare", "Dickens", "Austen", "Tolkien"],
        correct_option: 0,
      },
      {
        id: 3,
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct_option: 1,
      },
      {
        id: 4,
        text: "What is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean",
        ],
        correct_option: 3,
      },
      {
        id: 5,
        text: "Who painted the Mona Lisa?",
        options: [
          "Vincent van Gogh",
          "Pablo Picasso",
          "Leonardo da Vinci",
          "Claude Monet",
        ],
        correct_option: 2,
      },
      {
        id: 6,
        text: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Pb"],
        correct_option: 1,
      },
      {
        id: 7,
        text: "Which element has the atomic number 1?",
        options: ["Hydrogen", "Oxygen", "Helium", "Carbon"],
        correct_option: 0,
      },
      {
        id: 8,
        text: "Who is known as the father of modern physics?",
        options: [
          "Isaac Newton",
          "Albert Einstein",
          "Nikola Tesla",
          "Galileo Galilei",
        ],
        correct_option: 1,
      },
      {
        id: 9,
        text: "What is the largest land animal?",
        options: [
          "African Elephant",
          "White Rhinoceros",
          "Giraffe",
          "Hippopotamus",
        ],
        correct_option: 0,
      },
      {
        id: 10,
        text: "In which year did the Titanic sink?",
        options: ["1910", "1912", "1914", "1920"],
        correct_option: 1,
      },
      {
        id: 11,
        text: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Platinum", "Diamond", "Iron"],
        correct_option: 2,
      },
    ],
  };

  // Seed a quiz into the in-memory DB
  createQuiz(quiz1);

  console.log("Database seeded with initial data.");
};
