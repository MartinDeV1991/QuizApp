import React from "react";

import "./quiz.css";

const QuizInitialization = (
    { startGame, handleMultipleChoiceChange, handleContinentChange, countryCapitalData, handleTypeChange
    }) => {

    function getContinentsList() {
        let continentsList = [];
        countryCapitalData.map((country) => {
            if (!continentsList.includes(country.continent)) {
                continentsList.push(country.continent);
            }
        });
        return continentsList;
    }
    const options = getContinentsList();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "15%",
                marginBottom: '50px'
            }}
        >
            <label className="mt-2 mb-2" htmlFor="multiple-choice">
                <input id="multiple-choice" type="checkbox" onClick={handleMultipleChoiceChange}></input>
                Multiple choice
            </label>
            <select id="continent-selection" onChange={handleContinentChange}>

                <option value="all">All</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <select id="type-selection" onChange={handleTypeChange}>

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