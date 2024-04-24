const express = require('express');
const mongoose = require('mongoose')
const fetchUser = require('../middleware/fetchUser');
const QuizzQuestions = require('../models/QuizzQuestions');
const Quizz = require('../models/Quizz');
const QuizzAttempts = require('../models/QuizzAttempts');
const router = express.Router();

// Fetching the quizz using the quizz key for sharing the response of the user
// This is used at attemptquizz component
router.get('/getquizz/:quizzId', fetchUser, async (req, res)=> {

    const quizzId = req.params.quizzId;

    try {
        const quizz = await Quizz.findOne({quizzId}).select({ '_id': 1, 'title': 1, 'quizzId': 1 });
      
        if(!quizz){
            console.log('Quizz Not Found Please Enter valid Quizzz Key');
            return res.status(404).send('Quizz Not Found Please Enter valid Quizzz Key');
        }
        
        const quizzquestions = await QuizzQuestions.findOne({quizz: quizz._id}).select('-questions.correctOption');
        
        return res.status(200).json(quizzquestions);
    } catch (error) {
        res.status(400).send('Quizz Not Found Please Enter valid Quizzz Key');
    }
})

// This request is used at home component
router.post('/getquizz', fetchUser, async (req, res)=> {

    const quizzId = req.body.quizzkey;

    try {
        console.log(quizzId)
        const quizz = await Quizz.findOne({quizzId: quizzId}).select({ '_id': 1, 'title': 1, 'quizzId': 1 });
        
        if(!quizz){
            console.log('Quizz Not Found Please Enter valid Quizzz Key');
            return res.status(404).send('Quizz Not Found Please Enter valid Quizzz Key');
        }
  
        res.status(200).json(quizz);
    } catch (error) {
        res.status(400).send('Quizz Not Found Please Enter valid Quizzz Key');
    }
})
// Posting the attempted quizz to the QuizzAttempts Model and the n verifying it 
// In this Post Request i am going to create a empty MongoDb doc which only contains userid, quizzid and date and the response will be blank i will update the response using the put method

router.post('/attempt/:quizzId', fetchUser, async(req, res) => {
    const quizzId = req.params.quizzId;

    try {
        const user = req.user.id;
        const { response } = req.body;

        let MarksObtained = 0;
        let totalMarks = 0;
        const quizz = await Quizz.findOne({quizzId});
        
       console.log(quizz)
        if(!quizz){
           return  res.status(404).send('quizz not found')
        }
        const quizzquestions = await QuizzQuestions.findOne({quizz: quizz._id});
        for (const question of quizzquestions.questions) {
            totalMarks += question.marks;
            console.log(`Question Marks: ${question.marks}`);
        }
        console.log(totalMarks)

        for (const resItem of response) {
            const question = quizzquestions.questions.find(q => q._id.equals(resItem.questionId));
            if (question) {
              // Find the correct option based on correctOptionIndex
              const correctOption = question.options[question.correctOptionIndex];
              resItem.correctOptionId = correctOption._id;
              console.log(resItem.selectedOptionId , ' ', correctOption._id.toString())
              // Check if selectedOptionId matches the correctOptionId
              if (resItem.selectedOptionId === correctOption._id.toString()) {
                MarksObtained += question.marks;
                resItem.isCorrect = true;
              }
            }
        }
        console.log(totalMarks);
        const attemptId = new mongoose.Types.ObjectId();
        console.log(attemptId);
        await QuizzAttempts.create({
            _id: attemptId,
            quizzid: quizz._id,
            user, 
            response,    
            MarksObtained: MarksObtained,   
            totalMarks: totalMarks    
        });
        const newAttempt = await QuizzAttempts.findOne({_id : attemptId, user}).select('-user');

        res.status(200).json(newAttempt);
        // res.send(newAttempt._id);
    } catch (error) {
        console.log(error)
        res.status(400).send('Quizz Not Found Please Enter valid Quizzz Key');
    }
})



// Fetching the Quizz Attempt History of the User

router.get('/history', fetchUser, async (req, res) => {
    const user = req.user.id;
    try {
        const attempthistory = await QuizzAttempts.find({user});
        let UpdatedAttempts = []
        // Using for...of loop with await
        for (const attempt of attempthistory) {
            const quizzDetails = await Quizz.findOne({ _id: attempt.quizzid }).select({ "quizzId": 1, "title": 1, "description": 1 });

            const newAttempt = {
                attemptId: attempt._id,
                quizzId: quizzDetails.quizzId,
                title: quizzDetails.title,
                description: quizzDetails.description,
                MarksObtained: attempt.MarksObtained,
                totalMarks: attempt.totalMarks,
                // response: attempt.response,
            };

            UpdatedAttempts.push(newAttempt);
        }
       
        if(!attempthistory){
            return res.send('No History Found')
        }
        res.status(200).json({"AttemptHistory" :UpdatedAttempts});
    } catch (error) {
        
    }
});

module.exports = router;