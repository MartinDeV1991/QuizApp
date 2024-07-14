import React from "react";

import "./quiz.css";

const QuizInitialization = ({ startGame, countryCapitalData, gameConfig, setGameConfig }) => {
    const options = Array.from(new Set(countryCapitalData.map((country) => country.continent)));

    return (
        <div className="initialization-container">
            <label htmlFor="multiple-choice">
                <input id="multiple-choice" checked={gameConfig.multipleChoice} type="checkbox" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, multipleChoice: e.target.checked }))}></input>
                Multiple choice
            </label>

            <select id="continent-selection" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, continent: e.target.value }))}>
                <option value="all">All</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <select id="type-selection" onChange={(e) => setGameConfig((prevConfig) => ({ ...prevConfig, type: e.target.value }))}>
                <option key="country -> capital" value="country -> capital">
                    Country to capital
                </option>
                <option key="capital -> country" value="capital -> country">
                    Capital to country
                </option>
                <option key="image -> country" value="image -> country">
                    Image to country
                </option>
            </select>
            <button onClick={startGame}>Start</button>
        </div >
    )
};

export default QuizInitialization;