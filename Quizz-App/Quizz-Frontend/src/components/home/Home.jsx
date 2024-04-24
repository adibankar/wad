import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AttemptQuizz from '../attemptquizz/AttemptQuizz'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Home.css"

const Home = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();

  const authToken = sessionStorage.getItem('authToken');
  const [isAuthorised, setIsAuthorised] = useState(true);
  const [quizz, setquizz] = useState(null);
  const [quizzNotFound, setquizzNotFound] = useState(false)

  const onSubmit = async (data)=>{
    try{
      const quizzId = data.quizzkey;
      const Uri = `http://localhost:3000/attemptquizz/getquizz`;
      const r = await axios.post(
        Uri,
        data,
        {headers:{
          'auth-token': authToken,
          'Content-Type': 'application/json',
        }}
      );
      console.log('Response:', r);

      if (r.status === 200) {
        setquizz(r.data);
        // Handle successful response
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
  
         
          if (error.response.status === 404) {
            console.log('Quizz not found');
            setquizzNotFound(true);
            
          }
          if(error.response.status === 401){
            setIsAuthorised(false);
          }
  
          // Handle other server response statuses if needed
        }
      } else {
        // Handle other non-Axios-related errors (e.g., network error, client-side error)
        console.error('Error submitting quizz data:', error);
      }
    }
    }
  
    const AttemptQuizz = (quizzId)=>{
      
      navigate(`/attemptquizz/${quizzId}`);
    }
  return (
    <div className='Home'>
      <form className="searchQuizz" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="">Enter a Quizz Key to Search for a Quizz</label>
        <span>
          <input type="text" placeholder='Quizz Key' {...register('quizzkey', {required: {value: true, message: 'This Field is required'}})} />
          <input type="submit" value={'Search Quizz'} />
        </span>
      </form>

      {quizz && (
        <div className='Quizz'>
          <p>Quizz Found </p>
          <span>
            <h2>{quizz.title}</h2>
            {/* <h4>{quizz.quizzId}</h4> */}
            <button onClick={()=> AttemptQuizz(quizz.quizzId)}>Attempt the Quizz</button>
          </span>
        </div>
      )}
      {!quizz  && quizzNotFound && (
        <div className="quizzNotFound">
          QuizzNotFound please enter a Valid Quizz Id
        </div>
      )}
      {!isAuthorised && (
        <div className="message">
          You are Not Loggged in Please Log in
        </div>
      )}
    </div>
  )
}

export default Home
