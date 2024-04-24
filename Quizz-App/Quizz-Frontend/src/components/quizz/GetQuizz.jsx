
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./GetQuizz.css"


const GetQuizz = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes]= useState(null);
  
    const [error, setError] = useState(null);
    const [isdeleteQuizz, setDeleteQuizz] = useState(false)
    const authToken = sessionStorage.getItem('authToken');

    const deleteQuizz = async (quizzId) => {
        try {
            alert('Are you Sure');
            const res = await axios.delete(`http://localhost:3000/quizz/${quizzId}`,{
                headers:{
                    'auth-token':authToken,
                }
            });
            setDeleteQuizz(true);
            console.log('res');   
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const fetchdata = async ()=>{
            try {
                
                const getUri = 'http://localhost:3000/quizz/';
                const res = await axios.get(getUri, {
                    headers:{
                      'auth-token': authToken,
                      'Content-Type': 'application/json',
                    }
                  });

               if(res.status === 200){
                const formattedQuizzes = res.data.map(quizz => {
                    const dateTimeParts = quizz.date.split("T");
                    const datePart = dateTimeParts[0];
                    const timePart = dateTimeParts[1].split(":").slice(0, 2).join(":");
                    quizz.Date = datePart.split('-').reverse().join('/');
                    quizz.time = timePart;
                    return quizz;
                });
                setQuizzes(formattedQuizzes);
               }
               else if(res.status === 404){
                setQuizzes(null);
               }
               if(res.status === 400){
                setQuizzes(null);
                console.log('quizzes not found for your account');
               }

            } catch (error) {
                
                if (error.response) {
                    if (error.response.status === 401) {
                        setQuizzes(null);
                        setError('Unauthorized: Please log in to access quizzes');
                    } else {
                        setQuizzes(null);
                        setError(`Error: ${error.response.status} - ${error.response.data.message}`);
                    }
                } else if (error.request) {
                    setQuizzes(null);
                    // The request was made but no response was received
                    setError('No response received from server');
                } else {
                    setQuizzes(null);
                    setError('Error making request: ' + error.message);
                }
            }
        }
        fetchdata();
        setDeleteQuizz(false);
        console.log(quizzes)
    }, [isdeleteQuizz]);
    
    

    
  return ( 
    <div className='showquizz'>
        {quizzes && quizzes.map((quizz, index) => (
            <div className="quizzContainer" key={quizz._id}>
                <div className="info">
                    <p className="title"><strong>Title: </strong>{quizz.title}</p>
                    <p><span className="date"><strong>Date Posted: </strong>{quizz.Date}</span></p>
                    <p><span className="time"><strong>Time: </strong>{quizz.time}</span></p>
                    <p className="description"><strong>Description: </strong>{quizz.description}</p>
                    <p className="TotalQuestions"><strong>Marks: </strong>{quizz.totalMarks}</p>
                    <p className="TotalQuestions"><strong>Total Questions: </strong>{quizz.totalQuestions}</p>
                </div>

                <div className="editbuttons">
                    <button className="edit" onClick={()=> {alert('Continue to Edit');navigate(`/generatequestions/${quizz.quizzId}`)}}><i className="fa-regular fa-pen-to-square"></i></button>
                    <button className="delete" onClick={()=> deleteQuizz(quizz.quizzId)}><i className="fa-solid fa-trash"></i></button>
                </div>
            </div>
        ))}
        

      
    </div>
);
}

export default GetQuizz
