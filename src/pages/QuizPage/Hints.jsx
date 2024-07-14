import React from "react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Hints = ({ answers, currentQuestionIndex }) => {

    const [hint1, setHint1] = useState(false);

    useEffect(() => {
        setHint1(false);
    }, [currentQuestionIndex]);

    return (
        <div>
            <Button onClick={() => setHint1(!hint1)}>Hint 1</Button>

            {
                hint1 && (
                    <div>
                        <strong>hint 1</strong>:{" "}
                        {Array.from(answers[currentQuestionIndex])
                            .map((char) => (char === " " ? " " : "*"))
                            .join("")}
                    </div>
                )
            }
        </div>
    )
}
export default Hints;