import React from "react";

import "./quiz.css";

const QuizInitialization = ({ startQuiz, countryCapitalData, gameConfig, setGameConfig }) => {
    const continentOptions = Array.from(new Set(countryCapitalData.map((country) => country.continent)));
    const questionDirection = [
        { key: "country -> capital", value: "country -> capital", label: "Country to capital" },
        { key: "capital -> country", value: "capital -> country", label: "Capital to country" },
        { key: "image -> country", value: "image -> country", label: "Image to country" }
    ];

    return (
        <div className="initialization-container">
            <label htmlFor="multiple-choice">
                <input id="multiple-choice" checked={gameConfig.multipleChoice} type="checkbox" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, multipleChoice: e.target.checked }))}></input>
                Multiple choice
            </label>

            <select id="continent-selection" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, continent: e.target.value }))}>
                <option value="all">All</option>
                {continentOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <select id="type-selection" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, type: e.target.value }))}>
                {questionDirection.map((option) => (
                    <option key={option.key} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button onClick={startQuiz}>Start</button>
        </div >
    )
};

export default QuizInitialization;