import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import "./quiz.css";
import QuizInitialization from "./QuizInitialization";
import { countryCapitalData } from "../../data/data";
import { WorldMap } from "pages";
import QuizContent from "./QuizContent.jsx";

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
    const [gameConfig, setGameConfig] = useState({
        multipleChoice: true,
        type: "country -> capital",
        continent: "all",
        maxQuestions: 10
    });

    const [gameState, setGameState] = useState({
        choices: [],
        feedback: "",
        currentQuestionIndex: -1,
        attempts: 0,
        status: "initialization",
        answered: false
    });

    const restartQuiz = () => {
        setGameState({ feedback: "", currentQuestionIndex: -1, attempts: 0, choices: [], status: "initialization", answered: false });
    };

    const startQuiz = () => {
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

    return (
        <div className="quiz-container">
            <div>
                {gameState.status === "playing" &&
                    <QuizContent
                        gameState={gameState}
                        setGameState={setGameState}
                        gameConfig={gameConfig}
                        dataRef={dataRef}
                        inputRef={inputRef}
                        generateMultipleChoiceAnswers={generateMultipleChoiceAnswers}
                    />
                }
                {gameState.status !== "initialization" &&
                    <Button onClick={restartQuiz}>Restart</Button>
                }

                {gameState.status === "initialization" &&
                    <QuizInitialization
                        startQuiz={startQuiz}
                        gameConfig={gameConfig}
                        setGameConfig={setGameConfig}
                        countryCapitalData={countryCapitalData}
                    />
                }
            </div>
            {gameState.status === "playing" &&
                <WorldMap
                    selectedCountry={dataRef.current[gameState.currentQuestionIndex].country}
                    showArrow={dataRef.current[gameState.currentQuestionIndex].population < 1000000}
                />
            }
        </div>
    );
};

export default Quiz;