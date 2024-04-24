import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import  axios from 'axios';
import { useParams } from 'react-router-dom';
import "./AttemptQuizz.css"


const AttemptQuizz = () => {

  const [questions, setquestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [quizzNotFound, setquizzNotFound] = useState(false);
  const [questionexists, setquestionexists] = useState(false)
  const [userStatus, setUserStatus] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    control ,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();

  // using field array to store the value of current question id and selected optionid
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'response', // Name for your FieldArray data
  });
   

  const { quizzId } = useParams();
  const authToken = sessionStorage.getItem('authToken');
  const Uri = `http://localhost:3000/attemptquizz/getquizz/${quizzId}`

  useEffect(()=>{
    const fetchQuizz = async (data)=>{
      try{
        const r = await axios.get(
          Uri,
          {headers:{
            'auth-token': authToken,
            'Content-Type': 'application/json',
          }}
        );
        // console.log(r);
        if(r.status === 200){
          setquestionexists(true)
          setquestions(r.data.questions);
        }
        else if( r.status === 404){
          setquizzNotFound(true);
        }
        else{
          console.log(r.status)
        }
      }catch(error){
        if (axios.isAxiosError(error)) {
          // Handle Axios-related errors
          console.error('Axios Error:', error.message);
          
          if (error.response) {
            // The server responded with an error status code (e.g., 404)
            console.log('Server responded with:', error.response.status);
    
            // Extract error message from server response data
            const errorMessage = error.response.data;
            console.log('Error Message:', errorMessage);
    
            // Check if the error is due to a specific condition (e.g., Quizz not found)
            if (error.response.status === 404) {
              console.log('Quizz not found');
              setquizzNotFound(true);
              // Optionally, display error message to the user or handle accordingly
            }
    
            // Handle other server response statuses if needed
          }
        } else {
          // Handle other non-Axios-related errors (e.g., network error, client-side error)
          console.error('Error submitting quizz data:', error);
        }


      }
    }
    fetchQuizz();
    if (questions && questions.length > 0) {
      setCurrentQuestionIndex(0);
    }
  }, [Uri, authToken, quizzId, questionexists]) ;

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };


  const [FormQuestion, setFormQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(null);
  const [submitsuccess, setsubmitSuceess] = useState(false);
  const displayQuestion = (question, index) => {
    console.log(question);
    setFormQuestion(question);
    setQuestionNumber(index + 1)
  }
  const onSubmitResponse = async (data) => {
    //console.log(data);

    try {
      const r = await axios.post( `http://localhost:3000/attemptquizz/attempt/${quizzId}`, data,
      {
        headers:{
          "auth-token": authToken,
          "Content-Type": "application/json"
        }
      });

      if(r.status === 200){
        setsubmitSuceess(true);
        console.log(r.data);
        alert('Quizz Submitted SuccessFully')

      }
      else{
        alert('Some Error Occurred')
      }
    } catch (error) {
      console.log(error)
    }

  }
  const [selectOption, setSelectedOption] = useState(null)

  return (

    

    <div className='attemptQuizzContainer'>

        {quizzNotFound && (
          <div className='quizzNotFound'>
            Please Enter valid quizz Id
          </div>
        )}

      {questions && (
        <div className='QuestionList'>
          {/* <h2>Quiz Questions</h2> */}
          <ul>
            {questions.map((question, index) => (
              <li key={question._id} >
                <button onClick={() => setCurrentQuestionIndex(index)} className={currentQuestionIndex === index ? 'questionSelected':''}>{index + 1}</button>
            
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Displaying Questions */}
      {currentQuestionIndex !== null && 

          
          <form action="" onSubmit={handleSubmit(onSubmitResponse)}>
            <div className="questionContainer">
              <label htmlFor="">Q{currentQuestionIndex + 1}  {questions[currentQuestionIndex].question}</label>
            </div>
            <ul>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <li key={option._id} >
                  <input
                    
                    type="radio"
                    {...register(`response[${currentQuestionIndex}].selectedOptionId`)}
                    value={option._id}
                    onChange={() => {
                     
                      setValue(`response[${currentQuestionIndex}].questionId`, questions[currentQuestionIndex]._id);
                      setValue(`response[${currentQuestionIndex}].selectedOptionId`, option._id);
                      console.log(fields[currentQuestionIndex]?.selectedOptionId  )
                      console.log('Fields:', fields);

                    }}  
                    checked={
                      fields[currentQuestionIndex] &&
                      fields[currentQuestionIndex].selectedOptionId === option._id
                    }
                  />
                   <label>{option.option}</label>
                </li>
                
              ))}
            </ul>
            <div className="navbuttons">
              <button type='button' className={currentQuestionIndex !== 0 ? 'prev active': 'prev'} onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Prev</button>
              <button type='button' className={currentQuestionIndex !== questions.length -1 ? 'next active': 'next'} onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length -1}>Next</button>
            </div>
            <hr />
            <input className='Submit' type="submit" value="Submit Response" />
        </form>
      }
    </div>
  )
}

export default AttemptQuizz
