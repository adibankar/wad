import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./AttemptHistory.css"

const AttemptHistory = () => {
    const authToken = sessionStorage.getItem('authToken');
    const [AttemptHistory, setAttempthistory] = useState([]);
    const [isAttemptHistory, setIsAttemptHistory] = useState(false)
    useEffect(()=>{
        const fetchAttemptHistory = async()=>{
            const r = await axios.get('http://localhost:3000/attemptquizz/history', { headers:{ 'auth-token': authToken } });
            // console.log(r.data);
        if(r.status === 200){
           
            const attempts = r.data.AttemptHistory;
            setIsAttemptHistory(true);
            setAttempthistory(attempts)   
          
        }
        }

        fetchAttemptHistory();
    }, [authToken, isAttemptHistory]);
    console.log(AttemptHistory);         

  return (
    <div className='AttemptHistoryContainer'>
    {AttemptHistory && AttemptHistory.length > 0 && (
        AttemptHistory.map((attempt, index) => (
            <div className="attemptContainer" key={attempt.attemptId}>
                <p className='title'><strong>Title: </strong>{attempt.title}</p>
                <p className="quizzId"><strong>QuizzId: </strong>{attempt.quizzId}</p>
                <p><strong>Marks Obtained : </strong> {attempt.MarksObtained} / {attempt.totalMarks}</p>
            </div>
        ))
    )}
</div>
  )
}

export default AttemptHistory
