
import React from "react";
import Hints from "./Hints";

const QuizContent = ({ gameState, setGameState,
    gameConfig,
    dataRef, inputRef,
    generateMultipleChoiceAnswers }) => {

    const question = gameState.currentQuestionIndex >= 0
        ? (gameConfig.type === 'country -> capital'
            ? dataRef.current[gameState.currentQuestionIndex].country
            : dataRef.current[gameState.currentQuestionIndex].capital)
        : "";

    const checkAnswer = (answer) => {
        const isCorrect = answer.toLowerCase() === (gameConfig.type === 'country -> capital'
            ? dataRef.current[gameState.currentQuestionIndex].capital.toLowerCase()
            : dataRef.current[gameState.currentQuestionIndex].country.toLowerCase());

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer(gameState.attempts);
        }

        const isLastQuestion = gameState.currentQuestionIndex >= Math.min(dataRef.current.length, gameConfig.maxQuestions) - 1;
        if (isLastQuestion) {
            setGameState((prev) => ({
                ...prev,
                currentQuestionIndex: -1,
                feedback: "Congratulations! You completed the quiz.",
                status: "finished",
            }));
        }
    };

    const handleIncorrectAnswer = (attempts) => {
        if (attempts >= 2) {
            setGameState((prev) => ({
                ...prev,
                feedback: `You answered incorrectly 3 times!`,
                answered: true
            }));
        } else {
            setGameState((prev) => ({
                ...prev,
                feedback: "Incorrect. Try again.",
                attempts: prev.attempts + 1,
            }));
        }
    }
    const handleCorrectAnswer = () => {
        setGameState((prev) => ({
            ...prev,
            feedback: `You answered correctly!`,
            answered: true
        }));
    };

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

    const setNextQuestion = () => {
        const newQuestionIndex = gameState.currentQuestionIndex + 1;
        const newChoices = generateMultipleChoiceAnswers(dataRef.current, gameConfig.type, newQuestionIndex);

        setGameState((prev) => ({
            ...prev,
            currentQuestionIndex: newQuestionIndex,
            feedback: "",
            attempts: 0,
            answered: false,
            choices: newChoices,
        }));
    }

    return (
        <div className="game-content-container">
            <h2>#{gameState.currentQuestionIndex + 1}: {question}</h2>
            {gameConfig.multipleChoice ? renderMultipleChoice() : renderInputForm()}

            {!gameState.answered && (
                <div>You have had {gameState.attempts} attempts for this question.
                    <Hints
                        answers={dataRef.current.map((d) => d.capital)}
                        currentQuestionIndex={gameState.currentQuestionIndex}
                    />
                </div>
            )}
            <div className="game-status">
                {gameState.feedback}
            </div>
            {gameState.answered && (
                <button className="btn btn-primary" onClick={setNextQuestion}>
                    Next question
                </button>
            )}
        </div>
    )
};

export default QuizContent;