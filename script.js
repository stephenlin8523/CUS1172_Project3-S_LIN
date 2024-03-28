// Constants
const API_URL = 'https://my-json-server.typicode.com/yourusername/yourrepository';
const QUIZ_ENDPOINT = '/quizzes';

// Global Variables
let quizData;
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Fetch quiz data from API
async function fetchQuizData(quizId) {
    try {
        const response = await fetch(`${API_URL}${QUIZ_ENDPOINT}/${quizId}`);
        const data = await response.json();
        quizData = data.questions;
        renderQuestion();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

// Render question
function renderQuestion() {
    const question = quizData[currentQuestionIndex];
    const templateSource = document.getElementById('quiz-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(question);
    document.getElementById('quizPage').innerHTML = html;
}

// Check answer
function checkAnswer() {
    const userAnswer = document.querySelector('input[name="answer"]:checked').value;
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        displayFeedback('Correct! Well done.', true);
    } else {
        displayFeedback('Incorrect. Try again.', false);
    }
}

// Display feedback
function displayFeedback(message, isCorrect) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('feedback');
    feedbackDiv.textContent = message;

    if (isCorrect) {
        feedbackDiv.classList.add('correct');
    } else {
        feedbackDiv.classList.add('incorrect');
        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Correct Answer: ${quizData[currentQuestionIndex].correctAnswer}`;
        feedbackDiv.appendChild(correctAnswer);
    }

    document.getElementById('quizPage').appendChild(feedbackDiv);

    setTimeout(() => {
        feedbackDiv.style.display = 'none';
        nextQuestion();
    }, 1000); // 1 second delay before moving to the next question
}

// Proceed to the next question or end quiz
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        renderQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    const score = Math.round((correctAnswers / quizData.length) * 100);
    const resultMessage = score >= 80 ? `Congratulations ${document.getElementById('studentName').value}! You passed the quiz.` : `Sorry ${document.getElementById('studentName').value}, you failed the quiz.`;
    document.getElementById('resultPage').innerHTML = `<h2>${resultMessage}</h2><p>Score: ${score}%</p>`;
    document.getElementById('quizPage').style.display = 'none';
    document.getElementById('resultPage').style.display = 'block';
}

// Event listeners
document.getElementById('startForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const quizId = document.getElementById('quizSelect').value;
    fetchQuizData(quizId);
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'block';
});

document.getElementById('quizPage').addEventListener('submit', function (event) {
    event.preventDefault();
    checkAnswer();
});
