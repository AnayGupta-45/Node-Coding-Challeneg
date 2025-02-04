let qIndex = 0;  
let points = 0;  
let topScores = [];  
let qList = [];  

const startBox = document.getElementById('start-container');  
const goButton = document.getElementById('start-button');  
const qBox = document.getElementById('question-container');  
const qText = document.getElementById('question');  
const aButtons = document.getElementById('answer-buttons');  
const nextBtn = document.getElementById('next-button');  
const scoreBox = document.getElementById('score-container');  
const scoreText = document.getElementById('score');  
const tryAgainBtn = document.getElementById('restart-button');  
const topScoresBox = document.getElementById('leaderboard-container');  
const topScoresList = document.getElementById('leaderboard');  
const qNumberText = document.createElement('div'); 
qNumberText.id = 'question-number';  

goButton.addEventListener('click', startQuiz);  
nextBtn.addEventListener('click', () => showNextQuestion());  
tryAgainBtn.addEventListener('click', () => startQuiz());  

fetch('/questions')  
    .then(response => response.json())  
    .then(questions => {  
        qList = shuffleArray(questions).slice(0, 10).map(q => ({  
            question: q.question,  
            answers: q.options.map(option => ({  
                text: option,  
                correct: option === q.answer  
            }))  
        }));  
    });  

function shuffleArray(array) {  
    for (let i = array.length - 1; i > 0; i--) {  
        const j = Math.floor(Math.random() * (i + 1));  
        [array[i], array[j]] = [array[j], array[i]];  
    }  
    return array;  
}  

function startQuiz() {  
    qIndex = 0;  
    points = 0;  
    startBox.classList.add('hidden');  
    qBox.classList.remove('hidden');  
    scoreBox.classList.add('hidden');  
    topScoresBox.classList.add('hidden');  
    qBox.insertBefore(qNumberText, qText); 
    showQuestion(qList[qIndex]);  
}  

function showQuestion(question) {  
    qNumberText.innerText = `Question ${qIndex + 1} of ${qList.length}`;  
    qText.innerText = question.question;  
    aButtons.innerHTML = '';  
    question.answers.forEach(answer => {  
        const button = document.createElement('button');  
        button.innerText = answer.text;  
        button.classList.add('btn');  
        button.addEventListener('click', () => selectAnswer(answer, button));  
        aButtons.appendChild(button);  
    });  
}  

function selectAnswer(answer, button) {  
    disableAnswerButtons();  
    if (answer.correct) {  
        button.classList.add('correct');  
        points++;  
    } else {  
        button.classList.add('incorrect');  
        Array.from(aButtons.children).find(btn => {  
            if (btn.innerText === qList[qIndex].answers.find(a => a.correct).text) {  
                btn.classList.add('correct');  
            }  
        });  
    }  
    if (qIndex < qList.length - 1) {  
        qIndex++;  
        nextBtn.classList.remove('hidden');  
    } else {  
        endQuiz();  
    }  
}  

function disableAnswerButtons() {  
    Array.from(aButtons.children).forEach(button => {  
        button.disabled = true;  
    });  
}  

function showNextQuestion() {  
    nextBtn.classList.add('hidden');  
    resetAnswerButtons();  
    showQuestion(qList[qIndex]);  
}  

function resetAnswerButtons() {  
    Array.from(aButtons.children).forEach(button => {  
        button.disabled = false;  
        button.classList.remove('correct', 'incorrect');  
    });  
}  

function endQuiz() {  
    qBox.classList.add('hidden');  
    scoreBox.classList.remove('hidden');  
    scoreText.innerText = points;  
    topScores.push(points);  
    topScores.sort((a, b) => b - a);  
    updateLeaderboard();  
    topScoresBox.classList.remove('hidden');  
}  

function updateLeaderboard() {  
    topScoresList.innerHTML = '';  
    topScores.slice(0, 5).forEach((score, index) => {  
        const li = document.createElement('li');  
        li.innerText = `${index + 1}. Score: ${score}`;  
        topScoresList.appendChild(li);  
    });  
}

const seeTopScoresBtn = document.getElementById('view-leaderboard');
const backToScoreBtn = document.getElementById('back-to-score');

seeTopScoresBtn.addEventListener('click', () => {
    scoreBox.classList.add('hidden');
    topScoresBox.classList.remove('hidden');
});

backToScoreBtn.addEventListener('click', () => {
    topScoresBox.classList.add('hidden');
    scoreBox.classList.remove('hidden');
});