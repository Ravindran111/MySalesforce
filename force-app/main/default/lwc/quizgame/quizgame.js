// quizApp.js
import { LightningElement, track } from 'lwc';

export default class quizgame extends LightningElement {
    @track showLogin = true;
    @track showQuiz = false;
    @track showFinish = false;
    @track name = '';
    @track email = '';
    @track currentQuestionIndex = 0;
    @track timeLeft = 300; // 5 minutes
    @track quizQuestions;

    // Sample Quiz Questions
    quizQuestions = [
        {
            question: 'What country has the highest life expectancy? ',
            options: ['Hong Kong','china','japan','korea'],
            correctAnswer: 'Hong Kong'
        },
        {
            question: 'What is the capital of France?',
            options: ['Paris', 'Berlin', 'London', 'Rome'],
            correctAnswer: 'Paris'
        },
        {
            question: 'How many bones do we have in an ear? ',
            options: ['2','3','4','5'],
            correctAnswer: '3'
        },

    ];

    connectedCallback() {
        setInterval(() => {
            if (this.showQuiz) {
                this.timeLeft--;
                if (this.timeLeft === 0) {
                    this.handleFinish();
                }
            }
        }, 1000);
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    startQuiz() {
        this.showLogin = false;
        this.showQuiz = true;
    }

    handleAnswer(event) {
        const selectedOption = event.target.label;
        if (selectedOption === this.quizQuestions[this.currentQuestionIndex].correctAnswer) {
            // Correct answer logic
        } else {
            // Incorrect answer logic
        }
        // Move to next question
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex === this.quizQuestions.length) {
            this.handleFinish();
        }
    }

    handleFinish() {
        this.showQuiz = false;
        this.showFinish = true;
    }

    playAgain() {
        this.showFinish = false;
        this.showLogin = true;
        this.currentQuestionIndex = 0;
        this.timeLeft = 300; // Reset timer
    }
}
