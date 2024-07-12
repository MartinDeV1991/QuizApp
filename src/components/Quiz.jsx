import React from "react";
import { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
import "./quiz.css";
import QuizInitialization from "./QuizInitialization";
import Hints from "./Hints";
import { countryCapitalData } from "../data/data";

const Quiz = () => {

	const maxQuestions = 10;

	const [multipleChoice, setMultipleChoice] = useState(true);
	const [choices, setChoices] = useState([]);

	const [input, setInput] = useState("");
	const [question, setQuestion] = useState("");
	const [feedback, setFeedback] = useState("");
	const [correct, setCorrect] = useState(false);
	const [displayInput, setDisplayInput] = useState(true);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [data, setData] = useState([]);


	const [continent, setContinent] = useState("all");
	const [gameStarted, setGameStarted] = useState(false);
	const [gameFinished, setGameFinished] = useState(false);

	const [attempts, setAttempts] = useState(0);


	useEffect(() => {
		
	}, []);

	useEffect(() => {
		if (data.length > 0) {
			let multipleChoiceAnswers = [];
			let answerList = data.filter((answer) => answer.continent === data[currentQuestionIndex].continent);
			let selectedIndices = new Set();

			multipleChoiceAnswers.push(data[currentQuestionIndex].capital);
			for (let i = 0; i < 3; i++) {
				let index;
				if (answerList.length > 3) {
					do {
						index = Math.floor(Math.random() * answerList.length);
					} while (selectedIndices.has(index) || index === currentQuestionIndex);
					selectedIndices.add(index);
					multipleChoiceAnswers.push(answerList[index].capital);
				} else {
					index = Math.floor(Math.random() * answerList.length);
					multipleChoiceAnswers.push(answerList[index].capital);
				}
			}
			setChoices(multipleChoiceAnswers);

			setQuestion(data[currentQuestionIndex].country);
			setInput("");
		}

	}, [currentQuestionIndex, data]);

	const restartQuiz = () => {
		setCurrentQuestionIndex(0);
		setGameStarted(false);
		setGameFinished(false);
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const submitAnswer = async (e) => {
		e.preventDefault();
		checkAnswer(input);
	}

	const startGame = async () => {
		try {
			const data = countryCapitalData;
			let filteredData = data;
			if (continent !== "all") {
				console.log("filtering")
				filteredData = data.filter((country) => country.continent === continent);
			}
			console.log(filteredData);
			filteredData.sort(() => Math.random() - 0.5);
			setData(filteredData);
			setGameStarted(true);
		} catch (error) {
			console.log(error);
		}
	};

	const checkAnswer = async (answer) => {
		setCorrect(false);
		const userAnswer = answer;
		const isCorrect = userAnswer.toLowerCase() === data[currentQuestionIndex].capital.toLowerCase();
		const isLastQuestion = currentQuestionIndex >= Math.min(data.length, maxQuestions) - 1;

		if (isCorrect || attempts >= 2) {
			setCorrect(isCorrect);
			const feedbackMessage = `You answered ${isCorrect ? "correctly" : "incorrectly"}. The answer was "${data[currentQuestionIndex].capital}".`;

			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
			if (!isLastQuestion) {
				setDisplayInput(false);
				setFeedback(feedbackMessage);
				setTimeout(() => {
					setAttempts(0);
					setDisplayInput(true);
				}, 1000);
			} else if (isLastQuestion) {
				setInput("");
				setDisplayInput(false);
				setTimeout(() => {
					setGameFinished(true);
					setGameStarted(false);
					setFeedback("Congratulations! You completed the quiz.");
				}, 3000);
			}
		} else {
			setFeedback("Incorrect. Try again.");
			setAttempts(attempts + 1);
		}
	};


	return (
		<Container className="mt-4">
			<div style={{ width: '50%' }}>
				<h1>Quiz Game with Hints</h1>
				<div style={{ color: correct === true ? "green" : "red", fontSize: "30px", display: !gameFinished ? "none" : "block" }}>{feedback}</div>
				{gameStarted &&
					!gameFinished && (
						<div>
							<div style={{ display: displayInput ? "block" : "none" }}>
								<div><strong>Question #{currentQuestionIndex + 1}</strong></div>
								<div>Translate: <strong>{question}</strong></div>
							</div>
							<div style={{ color: correct === true ? "green" : "red", fontSize: "30px", display: displayInput ? "none" : "block" }}>{feedback}</div>

							{displayInput && (
								<>
									{!multipleChoice && (
										<Form onSubmit={submitAnswer} className="mb-5">
											<Form.Group controlId="inputBox">
												<Form.Control
													type="text"
													placeholder="Type your answer here"
													onChange={handleInputChange}
													style={{ width: "300px", display: displayInput ? "block" : "none" }}
												/>
											</Form.Group>
											<Button variant="primary" type="submit">
												Submit
											</Button>
										</Form>
									)}
									{multipleChoice && (
										<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', justifyContent: 'start', width: '20%' }}>
											{choices.map((choice, index) => (
												<button
													key={index}
													type="button"
													onClick={() => checkAnswer(choice)}
													style={{ width: '100%', height: '50px', margin: '0', padding: '0', backgroundColor: 'rgb(0, 200, 250, 1)' }}
												>
													{choice}
												</button>
											))}
										</div>
									)}
									<div>You have had {attempts} attempts for this question.</div>
									<Hints
										answers={data.map((d) => d.capital)}
										currentQuestionIndex={currentQuestionIndex}
									/>
								</>
							)}
						</div>
					)}{" "}
				{currentQuestionIndex > 0 && !gameFinished && (
					<Button onClick={restartQuiz}>Restart</Button>
				)}
			</div>
			{!gameStarted &&
				<QuizInitialization
					startGame={startGame}
					handleMultipleChoiceChange={(e) => setMultipleChoice(e.target.checked)}
					handleContinentChange={(e) => setContinent(e.target.value)}
					countryCapitalData={countryCapitalData}
				/>}
		</Container >
	);
};

export default Quiz;
