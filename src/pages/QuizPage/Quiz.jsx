import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import "./quiz.css";
import QuizInitialization from "./QuizInitialization";
import Hints from "./Hints";
import { countryCapitalData } from "../../data/data";
import { WorldMap } from "pages";


const generateMultipleChoiceAnswers = (data, type, currentQuestionIndex) => {
    const answerList = data
        .map((answer) => (type === "country -> capital" ? answer.capital : answer.country));

    const correctAnswer = answerList[currentQuestionIndex];
    const otherAnswers = answerList
        .filter(answer => answer !== correctAnswer);
    return selectMultipleChoiceAnswers(correctAnswer, otherAnswers);
}

const selectMultipleChoiceAnswers = (correctAnswer, otherAnswers) => {
    const shuffledOtherAnswers = otherAnswers
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    return [correctAnswer, ...shuffledOtherAnswers].sort(() => 0.5 - Math.random());
};

const Quiz = () => {
    const inputRef = useRef(null);
    const dataRef = useRef([]);
    const maxQuestions = 10;
    const [gameConfig, setGameConfig] = useState({
        multipleChoice: true,
        type: "country -> capital",
        continent: "all",
    });

    const [gameState, setGameState] = useState({
        choices: [],
        feedback: "",
        currentQuestionIndex: -1,
        attempts: 0,
        status: "initialization",
        answered: false
    });

    const restartQuiz = () => setGameState({ feedback: "", currentQuestionIndex: -1, attempts: 0, choices: [], status: "initialization", answered: false });

    const startGame = () => {
        const filteredData = gameConfig.continent === "all"
            ? countryCapitalData
            : countryCapitalData.filter((country) => country.continent === gameConfig.continent);
        dataRef.current = filteredData.sort(() => Math.random() - 0.5);
        setGameState({
            feedback: "",
            currentQuestionIndex: 0,
            attempts: 0,
            choices: generateMultipleChoiceAnswers(dataRef.current, gameConfig.type, 0),
            status: "playing",
            answered: false
        });
    };

    const checkAnswer = (answer) => {
        const isCorrect = answer.toLowerCase() === (gameConfig.type === 'country -> capital'
            ? dataRef.current[gameState.currentQuestionIndex].capital.toLowerCase()
            : dataRef.current[gameState.currentQuestionIndex].country.toLowerCase());
        const isLastQuestion = gameState.currentQuestionIndex >= Math.min(dataRef.current.length, maxQuestions) - 1;

        if (isCorrect || gameState.attempts >= 2) {
            handleCorrectAnswer(isLastQuestion);
        } else {
            setGameState((prev) => ({ ...prev, feedback: "Incorrect. Try again.", attempts: prev.attempts + 1, }));
        }
    };

    const handleCorrectAnswer = (isLastQuestion) => {
        const feedbackMessage = `You answered correctly!`;
        setGameState((prev) => ({
            ...prev,
            feedback: feedbackMessage,
            answered: true
        }));

        if (isLastQuestion) {
            setGameState((prev) => ({
                ...prev,
                currentQuestionIndex: -1,
                feedback: "Congratulations! You completed the quiz.",
                status: "finished",
            }));
        }
    };

    const question = gameState.currentQuestionIndex >= 0
        ? (gameConfig.type === 'country -> capital'
            ? dataRef.current[gameState.currentQuestionIndex].country
            : dataRef.current[gameState.currentQuestionIndex].capital)
        : "";

    return (
        <div className="quiz-container">
            <div>
                <h1>Quiz Game with Hints</h1>
                {renderGameStatus()}
                {renderGameContent()}
                {renderRestartButton()}

                {gameState.status === "initialization" && (
                    <QuizInitialization
                        startGame={startGame}
                        gameConfig={gameConfig}
                        setGameConfig={setGameConfig}
                        countryCapitalData={countryCapitalData}
                    />
                )}
            </div>
            {gameState.status === "playing" &&
                <WorldMap selectedCountry={dataRef.current[gameState.currentQuestionIndex].country} />
            }
        </div>
    );

    function renderGameStatus() {
        if (gameState.status !== "initialization") {
            return (
                <div className="game-status">
                    {gameState.feedback}
                </div>
            );
        }
        return null;
    }

    function renderGameContent() {
        if (gameState.status === "playing") {
            return (
                <div className="game-content-container">
                    <div><strong>Question #{gameState.currentQuestionIndex + 1}</strong></div>
                    <div><strong>{question}</strong></div>
                    {gameConfig.multipleChoice ? renderMultipleChoice() : renderInputForm()}
                    <div>You have had {gameState.attempts} attempts for this question.</div>
                    {!gameState.answered && <Hints
                        answers={dataRef.current.map((d) => d.capital)}
                        currentQuestionIndex={gameState.currentQuestionIndex}
                    />
                    }
                    {gameState.answered && (
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                setGameState((prev) => {
                                    const newQuestionIndex = prev.currentQuestionIndex + 1;
                                    const newChoices = generateMultipleChoiceAnswers(dataRef.current, gameConfig.type, newQuestionIndex);
                                    return {
                                        ...prev,
                                        currentQuestionIndex: newQuestionIndex,
                                        feedback: "",
                                        attempts: 0,
                                        answered: false,
                                        choices: newChoices,
                                    };
                                })
                            }
                        >
                            Next question
                        </button>
                    )}
                </div>
            );
        }
        return null;
    }

    function renderMultipleChoice() {
        return (
            !gameState.answered &&
            <div className="multiple-choice-container">
                {gameState.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => checkAnswer(choice)}
                        className="choice-button"
                    >
                        {choice}
                    </button>
                ))}
            </div>
        );
    }

    function renderInputForm() {
        return (
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your answer here"
                    ref={inputRef}
                    className="answer-input"
                />
                <button
                    onClick={() => {
                        if (inputRef.current) { checkAnswer(inputRef.current.value); inputRef.current.value = ''; }
                    }}
                    className="submit-button"
                >
                    Submit
                </button>
            </div>
        );
    }

    function renderRestartButton() {
        if (gameState.status === "playing" || gameState.status === "finished") {
            return <Button onClick={restartQuiz}>Restart</Button>;
        }
        return null;
    }
};

export default Quiz;