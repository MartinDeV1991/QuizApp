
import React from "react";
import Hints from "./Hints";
import WorldMap from "components/Map/WorldMap";

const QuizContent = ({ gameState, setGameState, gameConfig, dataRef, inputRef, generateMultipleChoiceAnswers }) => {
    let question = getQuestion();

    function getQuestion() {
        let question = "";
        if (gameConfig.type === 'country -> capital') {
            question = dataRef.current[gameState.currentQuestionIndex].country
        } else if (gameConfig.type === 'capital -> country') {
            question = dataRef.current[gameState.currentQuestionIndex].capital
        } else if (gameConfig.type === 'image -> country') {
            question = "What country is this shown on the map?";
        } else if (gameConfig.type === 'country -> image') {
            question = dataRef.current[gameState.currentQuestionIndex].country
        }
        return question;
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

    const renderMultipleChoice = () => {
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

    const renderInputForm = () => {
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

    return (
        <div style={{ display: 'flex' }}>
            <div className="game-content-container">
                <h2>#{gameState.currentQuestionIndex + 1}: {question}</h2>
                {gameConfig.type !== "country -> image" && (gameConfig.multipleChoice ? renderMultipleChoice() : renderInputForm())}

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
            <WorldMap
                selectedCountry={dataRef.current[gameState.currentQuestionIndex].country}
                showArrow={dataRef.current[gameState.currentQuestionIndex].population < 1000000}
                checkAnswer={checkAnswer}
                mapClick={gameConfig.type === "country -> image"}
            />
        </div>
    )
};

export default QuizContent;