import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizInitialization from "./QuizInitialization";
import Hints from "./Hints";
import { countryCapitalData } from "../data/data";
import { WorldMap } from "pages";

const Quiz = () => {
	const maxQuestions = 10;
	const [gameConfig, setGameConfig] = useState({
		multipleChoice: true,
		type: "country -> capital",
		continent: "all",
	});
	const [data, setData] = useState([]);
	const [gameState, setGameState] = useState({
		choices: [],
		input: "",
		feedback: "",
		correct: false,
		displayInput: true,
		currentQuestionIndex: 0,
		gameStarted: false,
		gameFinished: false,
		attempts: 0,
	});

	useEffect(() => {
		if (data.length > 0) {
			const answerList = data.filter(
				(answer) => answer.continent === data[gameState.currentQuestionIndex].continent
			);
			const multipleChoiceAnswers = generateMultipleChoiceAnswers(answerList);
			setGameState((prev) => ({ ...prev, choices: multipleChoiceAnswers, input: "" }));
		}
	}, [gameState.currentQuestionIndex, data]);

	const generateMultipleChoiceAnswers = (answerList) => {
		const correctAnswer = gameConfig.type === 'country -> capital'
			? data[gameState.currentQuestionIndex].capital
			: data[gameState.currentQuestionIndex].country;
		const otherAnswers = answerList
			.filter((_, index) => index !== gameState.currentQuestionIndex)
			.map(item => gameConfig.type === 'country -> capital' ? item.capital : item.country)
			.sort(() => 0.5 - Math.random())
			.slice(0, 3);
		return [correctAnswer, ...otherAnswers].sort(() => 0.5 - Math.random());
	};

	const restartQuiz = () => setGameState((prev) => ({ ...prev, currentQuestionIndex: 0, gameStarted: false, gameFinished: false }));

	const startGame = () => {
		console.log(gameState)
		const filteredData = gameConfig.continent === "all"
			? countryCapitalData
			: countryCapitalData.filter((country) => country.continent === gameConfig.continent);
		setData(filteredData.sort(() => Math.random() - 0.5));
		setGameState({
			choices: [],
			input: "",
			feedback: "",
			correct: false,
			displayInput: true,
			currentQuestionIndex: 0,
			gameStarted: true,
			gameFinished: false,
			attempts: 0
		});
	};

	const checkAnswer = (answer) => {
		const isCorrect = answer.toLowerCase() === (gameConfig.type === 'country -> capital'
			? data[gameState.currentQuestionIndex].capital.toLowerCase()
			: data[gameState.currentQuestionIndex].country.toLowerCase());
		const isLastQuestion = gameState.currentQuestionIndex >= Math.min(data.length, maxQuestions) - 1;

		if (isCorrect || gameState.attempts >= 2) {
			handleCorrectAnswer(isCorrect, isLastQuestion);
		} else {
			setGameState((prev) => ({ ...prev, feedback: "Incorrect. Try again.", attempts: prev.attempts + 1 }));
		}
	};

	const handleCorrectAnswer = (isCorrect, isLastQuestion) => {
		const feedbackMessage = `You answered ${isCorrect ? "correctly" : "incorrectly"}. The answer was "${data[gameState.currentQuestionIndex].capital}".`;
		setGameState((prev) => ({
			...prev,
			correct: isCorrect,
			currentQuestionIndex: prev.currentQuestionIndex + 1,
			displayInput: false,
			feedback: feedbackMessage,
		}));

		setTimeout(() => {
			if (isLastQuestion) {
				setGameState((prev) => ({
					...prev,
					gameFinished: true,
					gameStarted: false,
					feedback: "Congratulations! You completed the quiz.",
				}));
			} else {
				setGameState((prev) => ({ ...prev, attempts: 0, displayInput: true }));
			}
		}, isLastQuestion ? 3000 : 1000);
	};

	const question = gameState.gameStarted
		? (gameConfig.type === 'country -> capital'
			? data[gameState.currentQuestionIndex].country
			: data[gameState.currentQuestionIndex].capital)
		: "";

	return (
		<Container className="mt-4">
			<div style={{ width: '50%' }}>
				<h1>Quiz Game with Hints</h1>
				{gameState.gameFinished && <div style={{ color: gameState.correct ? "green" : "red", fontSize: "30px" }}>{gameState.feedback}</div>}
				{gameState.gameStarted && !gameState.gameFinished && (
					<div>
						{gameState.displayInput ? (
							<>
								<div><strong>Question #{gameState.currentQuestionIndex + 1}</strong></div>
								<div>Translate: <strong>{question}</strong></div>
								{gameConfig.multipleChoice ? (
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', justifyContent: 'start', width: '20%' }}>
										{gameState.choices.map((choice, index) => (
											<button key={index} onClick={() => checkAnswer(choice)} style={{ width: '100%', height: '50px', margin: '0', padding: '0', backgroundColor: 'rgb(0, 200, 250, 1)' }}>
												{choice}
											</button>
										))}
									</div>
								) : (
									<Form onSubmit={(e) => { e.preventDefault(); checkAnswer(gameState.input); }} className="mb-5">
										<Form.Group controlId="inputBox">
											<Form.Control
												type="text"
												placeholder="Type your answer here"
												onChange={(e) => setGameState((prev) => ({ ...prev, input: e.target.value }))}
												style={{ width: "300px" }}
											/>
										</Form.Group>
										<Button variant="primary" type="submit">Submit</Button>
									</Form>
								)}
								<div>You have had {gameState.attempts} attempts for this question.</div>
								<Hints answers={data.map((d) => d.capital)} currentQuestionIndex={gameState.currentQuestionIndex} />
							</>
						) : (
							<div style={{ color: gameState.correct ? "green" : "red", fontSize: "30px" }}>{gameState.feedback}</div>
						)}
						<WorldMap selectedCountry={data[gameState.currentQuestionIndex].country} />
					</div>
				)}
				{gameState.currentQuestionIndex > 0 && !gameState.gameFinished && <Button onClick={restartQuiz}>Restart</Button>}
			</div>
			{!gameState.gameStarted && (
				<QuizInitialization
					startGame={startGame}
					gameConfig={gameConfig}
					setGameConfig={setGameConfig}
					countryCapitalData={countryCapitalData}
				/>
			)}
		</Container>
	);
};

export default Quiz;