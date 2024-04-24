import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import GetQuizz from "../quizz/GetQuizz";
import axios from "axios";
import "./GenerateQuestions.css";

const GenerateQuestions = () => {
  const { quizzId } = useParams();
  const [questionId, setQuestionId] = useState(null);
  const postUri = "http://localhost:3000/quizz/generatequestions/" + quizzId;
  // Getting authToken from Session Storage
  const authToken = sessionStorage.getItem("authToken");

  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
    defaultValue: [{ option: "" }],
    rules: { minLength: 2, maxLength: 6 },
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [updatedForm, setUpdatedForm] = useState(false);
  const [questionExist, setquestionexists] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [addOption, setAddOption] = useState(false);

  // useEffect(() => {
  //   setValue('options', [{ option: '' }, { option: '' }]);
  // }, [setValue]);.

  const onSubmit = async (data) => {
    data.correctOptionIndex = correctOptionIndex;

    try {
      if (questionId) {
        // Update existing question (PUT request)
        data.questionId = questionId;

        console.log(data);
        const putUri = `http://localhost:3000/quizz/updatequestion/${quizzId}/${questionId}`;
        const response = await axios.put(putUri, data, {
          headers: {
            "auth-token": authToken,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          // Handle success
          setQuestions(response.data.questions);
          alert("Question Updated");
          setUpdatedForm(true);
          setQuestionId(null); // Reset questonId after update
          resetForm();

          // setting current question index to the questions .length
          setCurrentQuestionIndex(questions.length);
        }
      } else {
        // Create new question (POST request)
        const response = await axios.post(postUri, data, {
          headers: {
            "auth-token": authToken,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          // Handle success
          setQuestions(response.data.questions);
          console.log(questions.length);
          setCurrentQuestionIndex(questions.length + 1);
          alert("Question Saved");
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  useEffect(() => {
    if (quizzId) {
      console.log(quizzId);
      // Fetching the quizz from the database for the owner
      const fetchquizz = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/quizz/getquizz/${quizzId}`,
            {
              headers: {
                "auth-token": authToken,
                "Content-Type": "application/json",
              },
            }
          );
          setAddOption(true);
          if (res.status === 200) {
            if (res.data.questions) {
              setQuestions(res.data.questions);
              const initialQuestion = res.data.questions[currentQuestionIndex]; // Get the first question
              console.log(initialQuestion.correctOptionIndex);
              setValue("question", initialQuestion.question);
              setValue("marks", initialQuestion.marks);
              setValue("options", initialQuestion.options);
              setValue(
                "correctOptionIndex",
                initialQuestion.correctOptionIndex
              );
              setCorrectOptionIndex(initialQuestion.correctOptionIndex);
              // setCurrentQuestionIndex(0); // Set the current question index to the first question
              setquestionexists(true);
            } else {
              // Get the first question
              setValue("question", "");
              setValue("marks", "");
              setValue("options", "");
              setValue("correctOptionIndex", "");
              // setCorrectOptionIndex(null)
              // setCurrentQuestionIndex(0); // Set the current question index to the first question
              setquestionexists(true);
            }
          } else {
            setquestionexists(false);
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      };
      if (quizzId) {
        fetchquizz();
      }
      setUpdatedForm(false);
    }
  }, [questionExist, currentQuestionIndex, updatedForm]);

  // Creating a variable for storing the post url

  const resetForm = () => {
    reset({
      question: "",
      marks: "",
      options: [{ option: "" }, { option: "" }],
    });
    setCorrectOptionIndex(null);
    setQuestionId(null);
  };

  const handleOptionChange = (index) => {
    setCorrectOptionIndex(index);
  };

  return (
    <div className="generateQuestions">
      <div className="questionNoList">
        {questions && questions.length > 0 && quizzId && (
          <ul className="questionsContainer">
            {questions.map((question, index) => (
              <li key={question._id}>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setQuestionId(question._id);
                  }}
                  className={
                    currentQuestionIndex === index ? "questionSelected" : ""
                  }
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              {" "}
              <button
                className={
                  currentQuestionIndex === questions.length
                    ? "questionSelected"
                    : ""
                }
                onClick={() => {
                  resetForm();
                  setCurrentQuestionIndex(questions.length);
                }}
              >
                {questions.length + 1}
              </button>
            </li>            
          </ul>
        )}
        {/* Showing first question  */}
        {questions && questions.length === 0 && (
              <ul>
                <li>     
                <button
                  className="questionSelected"            
                >
                 1
                </button>
              </li>
              </ul>
            )}
        <button
          className="addquestion"
          onClick={() => {
            resetForm();
            setCurrentQuestionIndex(questions.length);
          }}
        >
          Add Question
        </button>
      </div>

      {
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="questionfield">
            <span>
              <label htmlFor="question">Question</label>
              <input
                type="number"
                placeholder="marks"
                {...register("marks", {
                  required: { value: true, message: "This Filed is Required" },
                })}
              />
            </span>
            <textarea
              placeholder="Question"
              {...register(`question`, { required: true })}
            ></textarea>
          </div>

          {/* Render dynamic options */}
          {questions &&
            fields.map((option, index) => (
              <div className="optionfield" key={option.id}>
                <label>
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionIndex === index}
                    {...register("correctOptionIndex", {
                      required: {
                        value: true,
                        message: "Please select the Correct Option",
                      },
                    })}
                    onChange={(event) => {
                      handleOptionChange(index);
                      // Prevent default behavior
                    }}
                  />
                  Correct
                </label>
                <textarea
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.option`, { required: true })}
                  defaultValue={option.option}
                />
                {/* Render "Remove" button only if there's more than one option */}
                {fields.length > 2 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

          {/* Button to add new option */}
          <span>
            <button
              type="button"
              onClick={() => {
                append({ option: "" }); // Add new empty option
              }}
            >
              Add Option
            </button>

            {/* Submit button */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </span>

          {/* Display validation errors */}
          {errors.question && <p className="error">Question is required</p>}
          {errors.options && (
            <p className="error">Please fill out all options</p>
          )}
          {errors.correctOptionIndex && (
            <p className="error">Please tell which option is Correct</p>
          )}
        </form>
      }
    </div>
  );
};

export default GenerateQuestions;
