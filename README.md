# Quiz App - API-based Backend

This is a RESTful API-based quiz application that allows users to answer multiple-choice questions and receive feedback on their performance. The app uses an in-memory database to store quizzes, questions, and user responses.

## Features

- **Create Quiz**: Add a new quiz with multiple-choice questions.
- **Get Quiz**: Retrieve a quiz by its ID without revealing the correct answers.
- **Submit Answer**: Submit an answer for a specific question and receive immediate feedback (correct or incorrect).
- **Get Results**: Fetch the user’s results for a quiz, including score and a summary of their answers.

## API Endpoints

### 1. **Create Quiz**
- **POST** `/api/quizzes`
  - Create a new quiz with a set of questions.

### 2. **Get Quiz by ID**
- **GET** `/api/quizzes/:id`
  - Retrieve a quiz by its ID without revealing the correct answers.

### 3. **Submit Answer**
- **POST** `/api/answers`
  - Submit an answer for a specific question in a quiz.

### 4. **Get Results**
- **GET** `/api/results/:id`
  - Retrieve the results for a specific quiz and user.

### Prerequisites
- Node.js (v14 or higher) and npm (or Yarn) installed.
- Docker (optional for containerized setup).

1. Clone the repository:
   git clone https://github.com/themagicalpanda/quiz-app-backend.git
   cd quiz_app_backend
   npm install
   npm run start

2. Docker Setup
   docker-compose build
   docker-compose up


### Improvements
- **Unit and Integration tests**: Tested locally but unit and integration tests not included due to time constraints.
- **Scoring Logic Enhancement**: The app currently lacks a robust scoring system. Enhancing the score calculation to update dynamically based on answers and ensuring it reflects correctly in the results would provide accurate feedback.
- **Error Handling & Validation**: More comprehensive error handling and input validation could be added to ensure that quiz data and user submissions are consistent and properly validated.
