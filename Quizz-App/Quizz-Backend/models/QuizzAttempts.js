const mongoose = require("mongoose");

const quizzAttemptSchema = new mongoose.Schema({
  quizzid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quizz",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  response: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizzquestion.questions.question",
      },
      selectedOptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizzquestion.questions.options.option",
      },
      correctOptionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizzquestion.questions.options.option",
      }
    },
  ],
  MarksObtained: {
    type: Number,
  },
  totalMarks:{
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("quizzattempts", quizzAttemptSchema);
