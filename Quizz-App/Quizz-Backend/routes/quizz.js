const express = require('express');
const Quizz = require('../models/Quizz');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/User');
const QuizzQuestions = require('../models/QuizzQuestions')

const router = express.Router();
const randomstring = require('randomstring');


// Getting all the quizzes created by the user
router.get('/', fetchUser, async (req, res) => {
    try {
        const user = req.user.id;
        const quizzs = await Quizz.find({ user: user });

        if (!quizzs || quizzs.length === 0) {
            return res.status(404).send('No Quizz found for your account');
        }

        // Fetch details for each quiz
        const quizzsWithDetails = [];
        for (const quizz of quizzs) {
            const quizzDetails = await QuizzQuestions.findOne({ quizz: quizz._id });
            // console.log('quizzDetails:',quizzDetails)
            if(quizzDetails.questions){
                // console.log(quizzDetails.questions);
                // Calculate totalMarks for each quizz
                let totalMarks = 0;
                quizzDetails.questions.forEach((question) => {
                    totalMarks += question.marks; // Assuming there's a field 'marks' for each question
                });

                // Append totalMarks and totalQuestions to the quizz object
                const quizzWithTotals = {
                    ...quizz.toJSON(), // Convert Mongoose document to plain object
                    totalQuestions: quizzDetails.questions.length,
                    totalMarks: totalMarks
                };
                quizzsWithDetails.push(quizzWithTotals);
            }
        }
        console.log(quizzsWithDetails)

        res.status(200).json(quizzsWithDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


// Creating a Collection named Quizz 
router.post('/generatequizzid',  [
        body('quizzname').isLength({ min: 3 }),
        body('noOfQuestions'),
    ], 
    fetchUser, 
    async (req, res) => {
        // console.log(req.user.id);
       
    try {
        const { title, description } = req.body;
        let newquizzId;
        let quizzExists = true;

        while (quizzExists) {
            newquizzId = randomstring.generate({length: 8, charset: 'abcdefghijklmnopqrstuvwxyz'});
            const existingQuizz = await Quizz.findOne({ quizzId: newquizzId });
            if (!existingQuizz) {
                quizzExists = false;
            }
        }
        let user = await User.findOne({ user: req.user.id });
        //console.log(user)

        const newQuizz = await Quizz.create({
            user: req.user.id,
            quizzId: newquizzId,
            title: title,
            description
        });
        const quizz  = await Quizz.findOne({quizzId: newquizzId});
        QuizzQuestions.create({
            quizz: quizz._id,
        })

        res.status(200).json({ quizzId: newquizzId ,response: newQuizz, userDetails: user});
    } catch (error) {
        console.error('Error creating quizz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/generatequestions/:quizzid', 
    fetchUser ,
    [
        body('question', 'Enter valid question').exists(),
        body('marks', 'Enter valid marks').isNumeric().exists(),
        body('correctOptionIndex', 'Enter valid correctOptionIndex').isNumeric().exists(),
    ], 
    async (req, res)=>{
    // console.log('Generate Questions')
    const quizzid = req.params.quizzid;
    // console.log(req.body)
   
    try {

        // fteching the quizz from the databse
        const quizz  = await Quizz.findOne({quizzId: quizzid});
        // console.log('quizz:',quizz)
        const quizzquestionsId = await QuizzQuestions.findOne({quizz: quizz._id});
        //console.log(quizzquestionsId._id)
        if(!quizz){
            return res.status(404).json({ error: 'Quizz not found' });

        }

        // Creating variable to store req.body
        // console.log(req.body    )
        const { question, options, correctOptionIndex, marks } = req.body;

         // Extract option texts from the options array
        
        // console.log(optionTexts)
        const newQuestion = {
            question,
            options: options,
            correctOptionIndex: correctOptionIndex,
            marks
        };
  
        console.log('updating quizz')
        // Pushing the new Question object in the existing quizz array
        const updatedQuizzQuestions = await QuizzQuestions.findByIdAndUpdate(
            quizzquestionsId._id,
            { $push: { questions: newQuestion } },
            { new: true }
        ).populate('questions');


        console.log('Updated')

        const quizzQuestions = await QuizzQuestions.findOne(quizzquestionsId._id);
        res.status(200).json(quizzQuestions);
        
        
    } catch (error) {
        console.error('Error creating quizz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})



// Get Request for Fetching the Quizz Questions for the Owner
router.get('/getquizz/:quizzId', fetchUser,
    async (req, res) => {
    try {
        const user = req.user;

        const quizzId = req.params.quizzId;
        const quizz = await Quizz.findOne({ quizzId: quizzId, user: user.id });

        if(!quizz){
            console.log('quizz not found in your history');
            return res.status(401).send('quizz not found in your history');
        }
        
        const quizzquestions = await QuizzQuestions.findOne({quizz: quizz._id});
        //console.log(quizzquestions);
        if (!quizzquestions) {
            return res.status(404).json({ error: 'Quizz not found' });
        }

        res.status(200).json(quizzquestions);
    } catch (error) {
        console.error('Error fetching quizz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// updating the question

router.put('/updatequestion/:quizzKey/:questionId', fetchUser,  async(req,res)=>{
    try {
        // console.log(req.body)s
        
        const quizzId = req.params.quizzKey;
        const questionId = req.params.questionId;
        
        // const updatedQuizzQuestions = await QuizzQuestions.findOneAndUpdate({quizz: quizzId, questions: questionId}),{new: true}
       
        const  quizz = await Quizz.findOne({quizzId});
        
        if(!quizz){
            return res.status(40).send('quizz not found');
        }

        const quizzQuestion = await QuizzQuestions.findOne({quizz: quizz._id})
        const questionIndex = quizzQuestion.questions.findIndex(question => question._id.equals(questionId));
        if (questionIndex === -1) {
            // console.log('not')
            return res.status(404).send('Question not found in this quiz');
        }
        // console.log('ho');
        quizzQuestion.questions[questionIndex] = req.body;
        await quizzQuestion.save();
        res.status(200).send('Question updated successfully');
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:quizzId', fetchUser, async(req,res)=>{
    try{
        const quizzId = req.params.quizzId;
        console.log('deleting')
        const quizz = await Quizz.findOne({quizzId});
        const quizzquestions = await QuizzQuestions.findOne({quizz: quizz._id});
        console.log(quizz._id);
        console.log(quizzquestions._id);
        if(quizz &&  quizzquestions){
            const deletedquizz = await Quizz.findByIdAndDelete({_id: quizz._id});
            const deletedQuizzQuestions = await QuizzQuestions.findByIdAndDelete({_id: quizzquestions._id});
            res.status(200).json({message: 'Deleted Successfully'});
        }
    }catch(error){
        console.log('Error deleting quizz');
    }
})

module.exports = router;
