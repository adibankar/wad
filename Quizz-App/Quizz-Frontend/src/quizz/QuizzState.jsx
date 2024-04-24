import react from "react";
import quizzContext from "./quizzContext";

const QuizzState =(props)=>{
    const state = {
        length : 3
    }

    return (

        <QuizzState.Provider value={state}>
            {props.children}
        </QuizzState.Provider>
    )
}

export default QuizzState